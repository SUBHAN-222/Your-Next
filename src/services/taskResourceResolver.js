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
// Mirrors the video path's one-click simplicity: extract a meaningful
// technology and topic from the roadmap task, then match against a curated
// list of reliable direct documentation URLs.

const TECHNOLOGIES = [
  ['react native', /react\s+native/i], ['next.js', /next(?:\.js|js)?/i], ['node.js', /node(?:\.js|js)?/i],
  ['javascript', /java\s?script/i], ['typescript', /type\s?script/i], ['python', /python/i],
  ['react', /react/i], ['angular', /angular/i], ['vue', /vue(?:\.js)?/i], ['html', /\bhtml\b/i],
  ['css', /\bcss\b/i], ['sql', /\bsql\b/i], ['git', /\bgit(?:hub)?\b/i], ['figma', /figma/i],
  ['linux', /\blinux\b/i], ['docker', /\bdocker\b/i], ['aws', /\baws\b/i],
  ['tensorflow', /tensorflow/i], ['pytorch', /pytorch/i], ['pandas', /pandas/i],
  ['numpy', /numpy/i], ['flask', /flask/i], ['django', /django/i],
  ['express', /express/i], ['mongodb', /mongo(?:db)?/i], ['postgresql', /postgres(?:ql)?/i],
  ['cybersecurity', /cyber\s?security|pentest|hacking/i], ['ui/ux', /ui\/ux|design/i]
]

const CURATED_DOCS = [
  // HTML
  { tech: 'html', keywords: ['form', 'input'], url: 'https://www.w3schools.com/html/html_forms.asp' },
  { tech: 'html', keywords: ['table'], url: 'https://www.w3schools.com/html/html_tables.asp' },
  { tech: 'html', keywords: ['link', 'anchor'], url: 'https://www.w3schools.com/html/html_links.asp' },
  { tech: 'html', keywords: ['semantic', 'structure', 'tag'], url: 'https://www.w3schools.com/html/html5_semantic_elements.asp' },
  { tech: 'html', keywords: ['image', 'img'], url: 'https://www.w3schools.com/html/html_images.asp' },
  { tech: 'html', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://www.w3schools.com/html/html_intro.asp' },

  // CSS
  { tech: 'css', keywords: ['flexbox', 'flex'], url: 'https://www.w3schools.com/css/css3_flexbox.asp' },
  { tech: 'css', keywords: ['grid'], url: 'https://www.w3schools.com/css/css_grid.asp' },
  { tech: 'css', keywords: ['box model', 'margin', 'padding'], url: 'https://www.w3schools.com/css/css_boxmodel.asp' },
  { tech: 'css', keywords: ['color', 'background'], url: 'https://www.w3schools.com/css/css_colors.asp' },
  { tech: 'css', keywords: ['text', 'font', 'typography'], url: 'https://www.w3schools.com/css/css_font.asp' },
  { tech: 'css', keywords: ['selector', 'class', 'id'], url: 'https://www.w3schools.com/css/css_selectors.asp' },
  { tech: 'css', keywords: ['layout', 'position'], url: 'https://www.w3schools.com/css/css_positioning.asp' },
  { tech: 'css', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://www.w3schools.com/css/css_intro.asp' },

  // JavaScript
  { tech: 'javascript', keywords: ['array', 'list'], url: 'https://www.w3schools.com/js/js_arrays.asp' },
  { tech: 'javascript', keywords: ['object', 'dictionary'], url: 'https://www.w3schools.com/js/js_objects.asp' },
  { tech: 'javascript', keywords: ['function'], url: 'https://www.w3schools.com/js/js_functions.asp' },
  { tech: 'javascript', keywords: ['variable', 'let', 'const'], url: 'https://www.w3schools.com/js/js_variables.asp' },
  { tech: 'javascript', keywords: ['loop', 'for', 'while', 'iterate'], url: 'https://www.w3schools.com/js/js_loop_for.asp' },
  { tech: 'javascript', keywords: ['condition', 'if', 'else', 'logic'], url: 'https://www.w3schools.com/js/js_if_else.asp' },
  { tech: 'javascript', keywords: ['dom', 'element', 'document'], url: 'https://www.w3schools.com/js/js_htmldom.asp' },
  { tech: 'javascript', keywords: ['event', 'listener', 'click'], url: 'https://www.w3schools.com/js/js_events.asp' },
  { tech: 'javascript', keywords: ['promise', 'async', 'await', 'fetch', 'api'], url: 'https://www.w3schools.com/js/js_async.asp' },
  { tech: 'javascript', keywords: ['basic', 'fundamental', 'start', 'intro', 'think'], url: 'https://www.w3schools.com/js/js_intro.asp' },

  // React
  { tech: 'react', keywords: ['component'], url: 'https://react.dev/learn/your-first-component' },
  { tech: 'react', keywords: ['state', 'usestate'], url: 'https://react.dev/learn/state-a-components-memory' },
  { tech: 'react', keywords: ['effect', 'useeffect'], url: 'https://react.dev/learn/synchronizing-with-effects' },
  { tech: 'react', keywords: ['prop'], url: 'https://react.dev/learn/passing-props-to-a-component' },
  { tech: 'react', keywords: ['event', 'click'], url: 'https://react.dev/learn/responding-to-events' },
  { tech: 'react', keywords: ['list', 'map'], url: 'https://react.dev/learn/rendering-lists' },
  { tech: 'react', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://react.dev/learn/describing-the-ui' },

  // Next.js
  { tech: 'next.js', keywords: ['routing', 'page'], url: 'https://nextjs.org/docs/app/building-your-application/routing/defining-routes' },
  { tech: 'next.js', keywords: ['data', 'fetch'], url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating' },
  { tech: 'next.js', keywords: ['api', 'route'], url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers' },
  { tech: 'next.js', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://nextjs.org/docs' },

  // Node.js
  { tech: 'node.js', keywords: ['express'], url: 'https://expressjs.com/en/starter/hello-world.html' },
  { tech: 'node.js', keywords: ['file', 'fs'], url: 'https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs' },
  { tech: 'node.js', keywords: ['api', 'http'], url: 'https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction' },
  { tech: 'node.js', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },

  // Python
  { tech: 'python', keywords: ['list', 'array', 'tuple'], url: 'https://docs.python.org/3/tutorial/datastructures.html' },
  { tech: 'python', keywords: ['dictionary', 'dict'], url: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' },
  { tech: 'python', keywords: ['function', 'def'], url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
  { tech: 'python', keywords: ['class', 'object', 'oop'], url: 'https://docs.python.org/3/tutorial/classes.html' },
  { tech: 'python', keywords: ['loop', 'for', 'while', 'iterate'], url: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' },
  { tech: 'python', keywords: ['if', 'condition', 'logic'], url: 'https://docs.python.org/3/tutorial/controlflow.html#if-statements' },
  { tech: 'python', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://docs.python.org/3/tutorial/appetite.html' },
  
  // Data Science (Pandas, Numpy)
  { tech: 'pandas', keywords: ['basic', 'fundamental', 'start', 'dataframe'], url: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/01_table_oriented.html' },
  { tech: 'numpy', keywords: ['basic', 'fundamental', 'start', 'array'], url: 'https://numpy.org/doc/stable/user/absolute_beginners.html' },

  // SQL
  { tech: 'sql', keywords: ['select', 'query', 'read'], url: 'https://www.w3schools.com/sql/sql_select.asp' },
  { tech: 'sql', keywords: ['join', 'relation'], url: 'https://www.w3schools.com/sql/sql_join.asp' },
  { tech: 'sql', keywords: ['where', 'filter'], url: 'https://www.w3schools.com/sql/sql_where.asp' },
  { tech: 'sql', keywords: ['insert', 'create'], url: 'https://www.w3schools.com/sql/sql_insert.asp' },
  { tech: 'sql', keywords: ['update'], url: 'https://www.w3schools.com/sql/sql_update.asp' },
  { tech: 'sql', keywords: ['basic', 'fundamental', 'start', 'intro', 'database'], url: 'https://www.w3schools.com/sql/sql_intro.asp' },

  // Git
  { tech: 'git', keywords: ['commit', 'add', 'save'], url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository' },
  { tech: 'git', keywords: ['branch'], url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging' },
  { tech: 'git', keywords: ['push', 'pull', 'remote', 'github'], url: 'https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes' },
  { tech: 'git', keywords: ['basic', 'fundamental', 'start', 'intro'], url: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F' },

  // Figma / UI UX
  { tech: 'figma', keywords: ['component'], url: 'https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma' },
  { tech: 'figma', keywords: ['auto layout'], url: 'https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties' },
  { tech: 'figma', keywords: ['prototype', 'interaction'], url: 'https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma' },
  { tech: 'figma', keywords: ['basic', 'fundamental', 'start', 'intro', 'design'], url: 'https://help.figma.com/hc/en-us/articles/360041064094-Figma-design-basics' },
  
  // Cybersecurity / Pentesting
  { tech: 'cybersecurity', keywords: ['linux', 'command', 'terminal'], url: 'https://ubuntu.com/tutorials/command-line-for-beginners' },
  { tech: 'cybersecurity', keywords: ['network', 'protocol'], url: 'https://www.w3schools.com/whatis/whatis_http.asp' },
  { tech: 'cybersecurity', keywords: ['web', 'security', 'owasp'], url: 'https://tryhackme.com/' }
]

const FALLBACK_DOCS = {
  'html': 'https://www.w3schools.com/html/',
  'css': 'https://www.w3schools.com/css/',
  'javascript': 'https://www.w3schools.com/js/',
  'typescript': 'https://www.typescriptlang.org/docs/',
  'react': 'https://react.dev/',
  'next.js': 'https://nextjs.org/docs',
  'node.js': 'https://nodejs.org/en/docs/',
  'python': 'https://docs.python.org/3/',
  'pandas': 'https://pandas.pydata.org/docs/',
  'numpy': 'https://numpy.org/doc/',
  'sql': 'https://www.w3schools.com/sql/',
  'git': 'https://git-scm.com/doc',
  'figma': 'https://help.figma.com/hc/en-us',
  'linux': 'https://ubuntu.com/tutorials/command-line-for-beginners',
  'docker': 'https://docs.docker.com/get-started/',
  'aws': 'https://aws.amazon.com/getting-started/',
  'tensorflow': 'https://www.tensorflow.org/tutorials',
  'pytorch': 'https://pytorch.org/tutorials/',
  'flask': 'https://flask.palletsprojects.com/en/stable/tutorial/',
  'django': 'https://docs.djangoproject.com/en/stable/intro/tutorial01/',
  'express': 'https://expressjs.com/en/starter/hello-world.html',
  'mongodb': 'https://www.mongodb.com/docs/manual/tutorial/getting-started/',
  'postgresql': 'https://www.postgresql.org/docs/current/tutorial.html',
  'cybersecurity': 'https://owasp.org/www-project-top-ten/',
  'ui/ux': 'https://lawsofux.com/'
}

function cleanText(value, max = 240) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function getCuratedDocUrl(task, field) {
  const name = cleanText(task?.name, 120).toLowerCase()
  const taskText = cleanText(task?.task, 180).toLowerCase()
  const fieldText = cleanText(field, 80).toLowerCase()
  const source = `${name} ${taskText} ${fieldText}`

  const technology = TECHNOLOGIES.find(([, expr]) => expr.test(source))?.[0] || cleanText(fieldText, 50).toLowerCase()

  let bestMatch = null
  let maxScore = 0

  for (const entry of CURATED_DOCS) {
    if (entry.tech === technology) {
      let score = 0
      for (const kw of entry.keywords) {
        if (source.includes(kw)) {
          score += 1
        }
      }
      if (score > maxScore) {
        maxScore = score
        bestMatch = entry
      }
    }
  }

  let finalUrl = null
  
  if (bestMatch && maxScore > 0) {
    finalUrl = bestMatch.url
  } else if (FALLBACK_DOCS[technology]) {
    finalUrl = FALLBACK_DOCS[technology]
  } else {
    // Field-aware fallback
    const fieldFallbackKeys = [
      { key: 'web', url: 'https://www.w3schools.com/where_to_start.asp' },
      { key: 'ai', url: 'https://developers.google.com/machine-learning/crash-course' },
      { key: 'machine learning', url: 'https://developers.google.com/machine-learning/crash-course' },
      { key: 'data', url: 'https://www.kaggle.com/learn' },
      { key: 'cyber', url: 'https://tryhackme.com/' },
      { key: 'security', url: 'https://tryhackme.com/' },
      { key: 'mobile', url: 'https://reactnative.dev/docs/getting-started' },
      { key: 'design', url: 'https://www.interaction-design.org/literature' },
      { key: 'ui', url: 'https://www.interaction-design.org/literature' },
      { key: 'ux', url: 'https://www.interaction-design.org/literature' },
      { key: 'university', url: 'https://cs50.harvard.edu/' },
      { key: 'cs', url: 'https://cs50.harvard.edu/' }
    ]
    const matchedField = fieldFallbackKeys.find(f => fieldText.includes(f.key))
    finalUrl = matchedField ? matchedField.url : 'https://www.w3schools.com/where_to_start.asp'
  }
  
  const displayTitle = (technology && technology !== fieldText) ? `${technology} (${fieldText})` : fieldText;
  
  return {
    title: `${displayTitle} documentation`.replace(/^\w/, c => c.toUpperCase()),
    url: finalUrl,
    provider: 'Official Resources',
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

    // Fallback: use the curated lookup table to get a direct exact match documentation URL
    const resource = getCuratedDocUrl(task, field)
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
