const YOUTUBE_SEARCH = 'https://www.googleapis.com/youtube/v3/search'
const YOUTUBE_VIDEOS = 'https://www.googleapis.com/youtube/v3/videos'
const YOUTUBE_RESULTS = 'https://www.youtube.com/results'
const YOUTUBE_OEMBED = 'https://www.youtube.com/oembed'

const TECHNOLOGIES = [
  ['react native', /react\s+native/i], ['next.js', /next(?:\.js|js)?/i], ['node.js', /node(?:\.js|js)?/i],
  ['javascript', /java\s?script/i], ['typescript', /type\s?script/i], ['python', /python/i],
  ['react', /react/i], ['angular', /angular/i], ['vue', /vue(?:\.js)?/i], ['html', /\bhtml\b/i],
  ['css', /\bcss\b/i], ['sql', /\bsql\b/i], ['git', /\bgit(?:hub)?\b/i], ['figma', /figma/i],
]

function cleanText(value, max = 240) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
}

// ISO 8601 duration parser e.g. "PT4M13S", "PT1H2M10S", "PT45S" -> seconds
function parseIso8601Duration(isoDuration) {
  if (!isoDuration) return 0
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  const matches = isoDuration.match(regex)
  if (!matches) return 0
  const days = parseInt(matches[1] || '0', 10)
  const hours = parseInt(matches[2] || '0', 10)
  const minutes = parseInt(matches[3] || '0', 10)
  const seconds = parseInt(matches[4] || '0', 10)
  return (days * 86400) + (hours * 3600) + (minutes * 60) + seconds
}

// Roadmap titles are motivational copy, not search terms. Convert each into a teachable objective first.
function learningObjective(body) {
  const name = cleanText(body?.task?.name, 120)
  const task = cleanText(body?.task?.task, 180)
  const field = cleanText(body?.field, 80)
  const level = cleanText(body?.level || 'beginner', 30).toLowerCase()
  const source = `${name} ${task} ${field}`
  const technology = TECHNOLOGIES.find(([, expression]) => expression.test(source))?.[0] || cleanText(field, 50)
  const titleTopic = name
    .replace(/^[^—–-]*?(?:start with|learn|understand|master|get comfortable with)\s+/i, '')
    .split(/[—–]/)[0]
    .replace(new RegExp(`\\b${technology.replace('.', '\\.')}\\b`, 'ig'), '')
    .replace(/\b(today|first|basics?|foundation|native language|the)\b/ig, '')
    .replace(/\s+/g, ' ').trim()
  const topic = cleanText(titleTopic || `${technology} fundamentals`, 80)
  const objective = cleanText(`${technology} ${topic || 'fundamentals'} ${task}`, 200)
  const version = cleanText(body?.task?.version || body?.version, 20)
  const queries = [...new Set([
    `${field} ${technology} ${topic} ${level} free course -shorts`,
    `${field} ${technology} ${topic} ${level} tutorial ${version} -shorts`,
    `${field} ${technology} ${topic || 'fundamentals'} tutorial -shorts`,
  ].map((query) => cleanText(query, 260)).filter(Boolean))]
  return { name, task, field, level, technology, topic, objective, version, queries }
}

function score(candidate, context) {
  const words = `${context.technology} ${context.topic} ${context.objective}`.toLowerCase().match(/[a-z0-9+#.]{3,}/g) || []
  const content = `${candidate.title} ${candidate.description || ''}`.toLowerCase()
  const coverage = words.length ? words.filter((word) => content.includes(word)).length / words.length : 0
  const official = /official|microsoft|google|aws|meta|react|freecodecamp|harvard|cs50/i.test(`${candidate.provider} ${candidate.title}`) ? 1 : 0
  const beginnerFit = context.level === 'beginner' && /beginner|basics|introduction|getting started|full course/i.test(content) ? 1 : 0
  const fresh = candidate.publishedAt ? Math.max(0, 1 - ((Date.now() - Date.parse(candidate.publishedAt)) / 315576000000)) : 0
  // Internal ranking: relevance 40, accuracy 20, freshness 15, source 10, level 5, free 5, usefulness 5.
  return coverage * 40 + official * 20 + fresh * 15 + beginnerFit * 5 + (candidate.isFree ? 5 : 0) + 5
}

async function apiYoutubeCandidates(context, apiKey) {
  const searchParams = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    type: 'video',
    q: context.queries[0],
    maxResults: '12',
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    order: 'relevance',
    videoDuration: 'medium', // 4 to 20 minutes
    regionCode: 'US'
  })
  const search = await fetch(`${YOUTUBE_SEARCH}?${searchParams}`, { signal: AbortSignal.timeout(8000) })
  if (!search.ok) throw new Error(`YouTube API search returned ${search.status}`)
  const ids = ((await search.json()).items || []).map((item) => item.id?.videoId).filter(Boolean)
  if (!ids.length) return []
  const details = await fetch(`${YOUTUBE_VIDEOS}?${new URLSearchParams({ key: apiKey, part: 'snippet,contentDetails,status', id: ids.join(',') })}`, { signal: AbortSignal.timeout(8000) })
  if (!details.ok) throw new Error(`YouTube API validation returned ${details.status}`)
  
  return ((await details.json()).items || [])
    .filter((item) => {
      if (item.status?.privacyStatus !== 'public' || item.status?.embeddable === false) return false
      const seconds = parseIso8601Duration(item.contentDetails?.duration)
      // Safety net: Reject any video under 4 minutes (240s)
      return seconds >= 240
    })
    .map((item) => ({
      title: cleanText(item.snippet?.title),
      url: `https://www.youtube.com/watch?v=${item.id}`,
      provider: cleanText(item.snippet?.channelTitle),
      type: 'video',
      isFree: true,
      publishedAt: item.snippet?.publishedAt || null,
      updatedAt: null,
      technology: context.technology,
      version: context.version || null,
      level: context.level,
      duration: item.contentDetails?.duration || null,
      durationSeconds: parseIso8601Duration(item.contentDetails?.duration),
      description: cleanText(item.snippet?.description, 500),
    }))
}

async function publicYoutubeCandidates(context) {
  // IDs originate in real YouTube search results, then public oEmbed verifies each video before use.
  const pages = await Promise.allSettled(context.queries.map(async (query) => {
    const response = await fetch(`${YOUTUBE_RESULTS}?${new URLSearchParams({ search_query: query })}`, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'YourNext learning resource resolver' } })
    if (!response.ok) throw new Error(`YouTube web search returned ${response.status}`)
    return response.text()
  }))
  const ids = [...new Set(pages.flatMap((page) => page.status === 'fulfilled'
    ? [...page.value.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((match) => match[1]) : []))].slice(0, 15)
  const validated = await Promise.allSettled(ids.map(async (id) => {
    const url = `https://www.youtube.com/watch?v=${id}`
    const response = await fetch(`${YOUTUBE_OEMBED}?${new URLSearchParams({ url, format: 'json' })}`, { signal: AbortSignal.timeout(6000) })
    if (!response.ok) throw new Error('Video is no longer public')
    const data = await response.json()
    // Reject titles containing "#shorts", "short", etc. if present in web fallback
    if (/#shorts|\bshorts\b|\bshort\b/i.test(data.title)) {
      throw new Error('Video is a YouTube Short')
    }
    return { title: cleanText(data.title), url, provider: cleanText(data.author_name), type: 'video', isFree: true, publishedAt: null, updatedAt: null, technology: context.technology, version: context.version || null, level: context.level, duration: null, description: '' }
  }))
  return validated.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST requests are allowed' })
  const context = learningObjective(req.body)
  if (!context.name) return res.status(400).json({ error: 'A roadmap task is required' })
  try {
    const discovery = [publicYoutubeCandidates(context)]
    if (process.env.YOUTUBE_API_KEY) discovery.push(apiYoutubeCandidates(context, process.env.YOUTUBE_API_KEY))
    const results = await Promise.allSettled(discovery)
    const candidates = [...new Map(results.flatMap((result) => result.status === 'fulfilled' ? result.value : []).map((candidate) => [candidate.url, candidate])).values()]
    const best = candidates
      .filter((candidate) => candidate.isFree && candidate.url && candidate.title)
      .map((candidate) => ({ ...candidate, rank: score(candidate, context) }))
      .sort((a, b) => b.rank - a.rank)[0]
    if (!best) return res.status(502).json({ error: 'We could not finish searching for a suitable video. Please retry.', code: 'RESOURCE_DISCOVERY_FAILED' })
    delete best.rank
    return res.status(200).json({ resource: { ...best, lastValidatedAt: new Date().toISOString() }, objective: { technology: context.technology, topic: context.topic, level: context.level } })
  } catch (error) {
    console.error('[resolve-learning-resource]', error.message || error)
    return res.status(502).json({ error: 'We could not finish searching for a suitable video. Please retry.', code: 'RESOURCE_DISCOVERY_FAILED' })
  }
}
