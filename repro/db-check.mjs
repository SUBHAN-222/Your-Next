import fs from 'node:fs'

// Parse .env
const env = {}
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
if (!url || !key) {
  console.log('NO CREDS: url=' + !!url + ' key=' + !!key)
  process.exit(0)
}

const res = await fetch(url + '/rest/v1/', { headers: { apikey: key, Authorization: 'Bearer ' + key } })
const spec = await res.json()
for (const t of ['profiles', 'roadmaps', 'roadmap_steps']) {
  const def = spec.definitions && spec.definitions[t]
  if (!def) { console.log(t + ': NOT FOUND in live DB'); continue }
  console.log(t + ': ' + Object.keys(def.properties).join(', '))
}