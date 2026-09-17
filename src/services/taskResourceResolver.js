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

export async function resolveTaskResource({ task, field, level = 'beginner', resourceType = 'video' }) {
  const key = taskKey(task, field, level, resourceType)
  const cache = readCache()
  if (validCached(cache[key])) return cache[key].resource

  if (resourceType === 'documentation') {
    if (!task?.resourceUrl) throw new Error('No verified documentation resource is available for this task yet.')
    const resource = {
      title: task.resourceTitle || 'Open learning resource', url: task.resourceUrl,
      provider: 'Roadmap resource', type: 'documentation', isFree: true,
      lastValidatedAt: new Date().toISOString(),
    }
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
