/**
 * E2E verification: roadmap generation + step completion sync to live Supabase.
 * Mocks ONLY /api/generate-roadmap (Vercel functions don't run in vite preview);
 * all Supabase traffic goes to the REAL project. Rows are read back through the
 * page's own authenticated session (RLS: auth.uid() = user_id).
 */
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:4173'

// --- parse .env ---
const env = {}
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const SB_URL = env.VITE_SUPABASE_URL
const SB_ANON = env.VITE_SUPABASE_ANON_KEY
if (!SB_URL || !SB_ANON) { console.error('FAIL: missing supabase creds in .env'); process.exit(1) }

const MOCK_PLAN = {
  field: 'Web Development',
  dontDoThisYet: { warning: 'Skip the frameworks', reason: 'Fundamentals first — frameworks will make sense after.' },
  steps: [
    { name: 'Learn HTML basics — structure first', why: 'HTML is the foundation of every site.', task: 'Build a simple page with your name.', time: '30-45 mins', resourceTitle: 'freeCodeCamp', resourceUrl: 'https://freecodecamp.org' },
    { name: 'Style it with CSS — make it yours', why: 'CSS turns structure into a real page.', task: 'Add colors and layout to your page.', time: '30-45 mins', resourceTitle: 'MDN', resourceUrl: 'https://mdn.dev' },
    { name: 'First JS steps — think in logic', why: 'JavaScript makes pages come alive.', task: 'Write a script that greets the user.', time: '45-60 mins', resourceTitle: 'MDN', resourceUrl: 'https://mdn.dev' },
    { name: 'Practice: rebuild a landing page', why: 'Rebuilding teaches faster than reading.', task: 'Rebuild a simple landing page from memory.', time: '1 hour', resourceTitle: 'The Odin Project', resourceUrl: 'https://odin.dev' },
    { name: 'Mini project — portfolio v1', why: 'A portfolio proves what you know.', task: 'Publish a one-page portfolio.', time: '2 hours', resourceTitle: 'YouTube', resourceUrl: 'https://youtube.com' },
    { name: 'Git basics — save your progress', why: 'Version control protects your work.', task: 'Push your portfolio to GitHub.', time: '30-45 mins', resourceTitle: 'GitHub', resourceUrl: 'https://github.com' },
    { name: 'Responsive design — mobile first', why: 'Most users are on phones.', task: 'Make your portfolio mobile-friendly.', time: '1 hour', resourceTitle: 'MDN', resourceUrl: 'https://mdn.dev' },
    { name: 'DOM practice — interactive page', why: 'Interactivity is what users remember.', task: 'Add a button that changes the page.', time: '45-60 mins', resourceTitle: 'W3Schools', resourceUrl: 'https://w3schools.com' },
    { name: 'Portfolio v2 — polish and ship', why: 'Shipping finishes the learning loop.', task: 'Deploy portfolio v2 and share it.', time: '2 hours', resourceTitle: 'YouTube', resourceUrl: 'https://youtube.com' },
  ],
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })

await page.setRequestInterception(true)
page.on('request', (req) => {
  const url = req.url()
  // Mock only the Vercel function — let everything else (esp. Supabase) through.
  if (req.method() === 'POST' && req.url().includes('/api/generate-roadmap')) {
    let body = {}
    try { body = JSON.parse(req.postData() || '{}') } catch {}
    if (body.mode === 'multi') {
      return req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PLAN) })
    }
    return req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ welcomeMessage: "You're stuck jumping between tutorials — that's totally normal. We'll fix that step by step." }) })
  }
  req.continue()
})

page.on('console', (msg) => {
  const t = msg.text()
  if (t.includes('using fallback') || t.includes('Failed')) console.log('PAGE LOG:', t)
})

// --- run the app ---
await page.goto(BASE, { waitUntil: 'networkidle2' })

async function clickFirst(sel, label) {
  await page.waitForSelector(sel, { timeout: 15000 })
  await page.click(sel)
  console.log(`clicked: ${label}`)
}

// Start quiz
await clickFirst('.cta', 'Start quiz CTA')

// Answer 5 quiz questions
for (let i = 0; i < 5; i++) {
  await page.waitForSelector('.quiz-card', { timeout: 15000 })
  await new Promise((r) => setTimeout(r, 400))
  const clicked = await page.evaluate(() => {
    const card = document.querySelector('#s-ob .quiz-card')
    if (!card) return false
    card.click()
    return true
  })
  if (!clicked) throw new Error(`quiz option not found on question ${i + 1}`)
  console.log(`answered question ${i + 1}`)
  await new Promise((r) => setTimeout(r, 700))
}
// __PART2__
