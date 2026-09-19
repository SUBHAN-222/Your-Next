const CACHE_KEY = 'yournext-task-resources-v1'
const VALIDATION_AGE_MS = 1000 * 60 * 60 * 24 * 14

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}

function writeCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch { /* storage is optional */ }
}

function taskKey(task, field, level, type) {
  return [type, field, level, task?.name, task?.task].map((part) => String(part || '').trim().toLowerCase()).join('|')
}

function validCached(entry) {
  return entry?.resource?.url && entry?.resource?.lastValidatedAt
    && Date.now() - Date.parse(entry.resource.lastValidatedAt) < VALIDATION_AGE_MS
}

// ── Documentation fallback ──────────────────────────────────────────────
// Mirrors the video path's YouTube search fallback: extract a meaningful
// search query from the roadmap task, then build a Google search URL
// scoped to reliable documentation/tutorial sites.

const TECHNOLOGIES = [
  ['react native', /react\s+native/i], ['next.js', /next(?:\.js|js)?/i], ['node.js', /node(?:\.js|js)?/i],
  ['javascript', /java\s?script/i], ['typescript', /type\s?script/i], ['python', /python/i],
  ['react', /react/i], ['angular', /angular/i], ['vue', /vue(?:\.js)?/i], ['html', /\bhtml\b/i],
  ['css', /\bcss\b/i], ['sql', /\bsql\b/i], ['git', /\bgit(?:hub)?\b/i], ['figma', /figma/i],
  ['linux', /\blinux\b/i], ['docker', /\bdocker\b/i], ['aws', /\baws\b/i],
  ['tensorflow', /tensorflow/i], ['pytorch', /pytorch/i], ['pandas', /pandas/i],
  ['numpy', /numpy/i], ['flask', /flask/i], ['django', /django/i],
  ['express', /express/i], ['mongodb', /mongo(?:db)?/i], ['postgresql', /postgres(?:ql)?/i],
]

const DOC_SITES = [
  'developer.mozilla.org',
  'w3schools.com',
  'freecodecamp.org',
  'docs.python.org',
  'react.dev',
  'nodejs.org',
  'learn.microsoft.com',
  'devdocs.io',
]

function cleanText(value, max = 240) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function buildDocSearchUrl(task, field) {
  const name = cleanText(task?.name, 120)
  const taskText = cleanText(task?.task, 180)
  const fieldText = cleanText(field, 80)
  const source = `${name} ${taskText} ${fieldText}`

  const technology = TECHNOLOGIES.find(([, expr]) => expr.test(source))?.[0] || cleanText(fieldText, 50)

  // Strip motivational prefixes to get the core topic
  const titleTopic = name
    .replace(/^[^—–-]*?(?:start with|learn|understand|master|get comfortable with)\s+/i, '')
    .split(/[—–]/)[0]
    .replace(new RegExp(`\\b${technology.replace('.', '\\.')}\\b`, 'ig'), '')
    .replace(/\b(today|first|basics?|foundation|native language|the)\b/ig, '')
    .replace(/\s+/g, ' ').trim()

  const topic = cleanText(titleTopic || `${technology} fundamentals`, 80)

  // Build a site-scoped Google search
  const siteScope = DOC_SITES.map((s) => `site:${s}`).join(' OR ')
  const query = `${technology} ${topic} beginner tutorial (${siteScope})`
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`

  return {
    title: `${technology} — ${topic} (documentation search)`.replace(/\s+/g, ' ').trim(),
    url: searchUrl,
    provider: 'Google (scoped to trusted docs)',
    type: 'documentation',
    isFree: true,
    lastValidatedAt: new Date().toISOString(),
  }
}

// ── Main resolver ───────────────────────────────────────────────────────

export async function resolveTaskResource({ task, field, level = 'beginner', resourceType = 'video' }) {
  const key = taskKey(task, field, level, resourceType)
  const cache = readCache()
  if (validCached(cache[key])) return cache[key].resource

  if (resourceType === 'documentation') {
    // If the roadmap step already ships a verified URL, prefer it.
    if (task?.resourceUrl) {
      const resource = {
        title: task.resourceTitle || 'Open learning resource', url: task.resourceUrl,
        provider: 'Roadmap resource', type: 'documentation', isFree: true,
        lastValidatedAt: new Date().toISOString(),
      }
      cache[key] = { resource }
      writeCache(cache)
      return resource
    }

    // Fallback: generate a curated doc-site search (mirrors video's YouTube search fallback).
    const resource = buildDocSearchUrl(task, field)
    cache[key] = { resource }
    writeCache(cache)
    return resource
  }

  const response = await fetch('/api/resolve-learning-resource', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, field, level }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data?.resource?.url) throw new Error(data?.error || 'We could not finish searching. Please try again.')
  cache[key] = { resource: data.resource }
  writeCache(cache)
  return data.resource
}

