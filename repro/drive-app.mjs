import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:4173/'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function makeWelcome(chars) {
  const line =
    "I know you feel lost trying to learn Web Development, and that's totally normal. " +
    'Most people get stuck because they jump between tutorials without a real plan. ' +
    'We will fix that step by step together, one small daily task at a time. '
  let msg = ''
  while (msg.length < chars) msg += line
  return msg.slice(0, chars).trim()
}

async function runScenario(browser, { label, viewport, msgChars, isMobile = false, hasTouch = false }) {
  const page = await browser.newPage()
  await page.setViewport({ ...viewport, isMobile, hasTouch })

  // Instrument wheel events BEFORE app scripts run
  await page.evaluateOnNewDocument(() => {
    window.__wheelLog = []
    window.addEventListener('wheel', (e) => {
      window.__wheelLog.push({
        phase: 'capture',
        target: e.target.tagName + (e.target.className ? '.' + String(e.target.className).split(' ')[0] : ''),
        x: e.clientX,
        y: e.clientY,
        deltaY: e.deltaY,
        prevented: false,
      })
    }, { capture: true, passive: true })
    window.addEventListener('wheel', (e) => {
      const last = window.__wheelLog[window.__wheelLog.length - 1]
      if (last) {
        last.phase = 'full'
        last.prevented = e.defaultPrevented
      }
    }, { capture: false, passive: true })
  })

  await page.setRequestInterception(true)
  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url().includes('/api/generate-roadmap')) {
      const body = req.postData() || ''
      if (body.includes('welcome')) {
        req.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ welcomeMessage: makeWelcome(msgChars) }),
        })
        return
      }
    }
    req.continue()
  })

  await page.goto(URL, { waitUntil: 'load', timeout: 30000 })
  await page.waitForSelector('.cta', { timeout: 15000 })
  await sleep(500)
  await page.click('.cta')
  await sleep(800)
  for (let i = 0; i < 5; i++) {
    await page.waitForSelector('.quiz-card:not([disabled])', { timeout: 15000 })
    await page.click('.quiz-card')
    await sleep(650)
  }

  // Duration screen reuses the #s-ob shell — click its first card to proceed
  await page.waitForSelector('#s-ob .quiz-card:not([disabled])', { timeout: 15000 })
  await sleep(400)
  await page.click('#s-ob .quiz-card')

  await page.waitForSelector('#s-ai-load', { timeout: 15000 })
  await sleep(2200)

  const state = await page.evaluate(() => {
    const describe = (el) => {
      if (!el) return null
      const c = getComputedStyle(el)
      return {
        sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
          (el.className ? '.' + String(el.className).split(' ')[0] : ''),
        position: c.position,
        overflowY: c.overflowY,
        scrollH: el.scrollHeight,
        clientH: el.clientHeight,
        h: c.height,
        maxH: c.maxHeight,
      }
    }
    const cx = Math.floor(window.innerWidth / 2)
    const cy = Math.floor(window.innerHeight / 2)
    let el = document.elementFromPoint(cx, cy)
    const chain = []
    while (el && chain.length < 12) {
      chain.push(describe(el))
      el = el.parentElement
    }
    return {
      innerHeight: window.innerHeight,
      docScrollHeight: document.documentElement.scrollHeight,
      htmlOverflow: getComputedStyle(document.documentElement).overflow,
      bodyOverflow: getComputedStyle(document.body).overflow,
      chainUnderCursor: chain,
    }
  })

  // --- Test 1: programmatic instant jump (can the viewport scroll at all?) ---
  const programmatic = await page.evaluate(() => {
    window.scrollTo({ top: 99999, behavior: 'instant' })
    const y = window.scrollY
    window.scrollTo({ top: 0, behavior: 'instant' })
    return y
  })

  // --- Test 2: real mouse wheel at centre ---
  await page.mouse.move(viewport.width / 2, viewport.height / 2)
  await page.mouse.wheel(0, 1200)
  await sleep(700)
  const wheelCenter = await page.evaluate(() => ({ y: window.scrollY, log: window.__wheelLog }))

  // --- Test 3: real mouse wheel near top-left corner (over html/body only) ---
  await page.evaluate(() => { window.__wheelLog = [] })
  await page.mouse.move(8, 8)
  await page.mouse.wheel(0, 1200)
  await sleep(700)
  const wheelCorner = await page.evaluate(() => ({ y: window.scrollY, log: window.__wheelLog }))

  // --- Test 4: CDP synthesizeScrollGesture (closest to a real user scroll) ---
  const client = await page.createCDPSession()
  await client.send('Input.synthesizeScrollGesture', {
    x: viewport.width / 2,
    y: viewport.height / 2,
    xDistance: 0,
    yDistance: -400,
    speed: 800,
  })
  await sleep(800)
  const synth = await page.evaluate(() => window.scrollY)

  await page.screenshot({ path: `repro/matrix-${label}.png` })
  const maxScroll = state.docScrollHeight - state.innerHeight
  console.log(`\n=== ${label} ===  maxScroll=${maxScroll}  programmatic=${programmatic}  wheelCenter=${wheelCenter.y}  wheelCorner=${wheelCorner.y}  synthGesture=${synth}`)
  console.log('chainUnderCursor:', JSON.stringify(state.chainUnderCursor))
  console.log('wheelLog(center):', JSON.stringify(wheelCenter.log))
  console.log('wheelLog(corner):', JSON.stringify(wheelCorner.log))
  await page.close()
}

const only = process.argv[2] // optional scenario label filter

const scenarios = [
  { label: 'desktop-long', viewport: { width: 1280, height: 800 }, msgChars: 2400 },
  { label: 'mobile', viewport: { width: 390, height: 844 }, msgChars: 1200, isMobile: true, hasTouch: true },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--disable-gpu'],
})

for (const s of scenarios) {
  if (only && s.label !== only) continue
  try {
    await runScenario(browser, s)
  } catch (e) {
    console.log(`[${s.label}] FAILED:`, String(e).slice(0, 200))
  }
}

await browser.close()
