// Live schema probe: verify every column my new sync code uses actually
// exists in the live DB. PostgREST errors name the missing column, so a
// 200 means all columns in the select list are real.
import fs from 'node:fs'

const env = fs.readFileSync('.env', 'utf8')
const getUrl = (k) => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1]?.trim()
const URL_BASE = getUrl('VITE_SUPABASE_URL')
const ANON = getUrl('VITE_SUPABASE_ANON_KEY')

const probes = [
  ['roadmaps', 'user_id,field,is_active,duration_months'],
  ['roadmap_steps', 'roadmap_id,step_index,day_number,name,why,time_estimate,resource_url,status'],
  ['roadmap_steps', 'completed,completed_at'],
]

for (const [table, cols] of probes) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=${cols}&limit=1`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  })
  const body = await res.text()
  if (res.ok) {
    console.log(`OK  ${table} (${cols}) -> ${res.status} ${body.slice(0, 120)}`)
  } else {
    console.log(`FAIL ${table} (${cols}) -> ${res.status} ${body.slice(0, 200)}`)
  }
}
