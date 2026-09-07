import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const APP = 'http://localhost:4173/'
const CONTROL =
  'file:///' + process.cwd().replace(/\\/g, '/') + '/repro/control.html'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const PLAN_DELAY_MS = 8000 // keep app on the loading screen for the whole probe

function makeWelcome(chars) {
  const line =
    "I know you feel lost trying to learn Web Development, and that's totally normal. " +
    'Most people get stuck because they jump between tutorials without a real plan. ' +
    'We will fix that step by step together, one small daily task at a time. '
  let msg = ''
  while (msg.length < chars) msg += line
  return msg.slice(0, chars).trim()
}

async function probe(browser, { label, url, viewport, isMobile = false, hasTouch = false, welcomeMsg = null }) {
  const page = await browser.newPage()
  await page.setViewport({ ...viewport, isMobile, hasTouch })

  await page.evaluateOnNewDocument((welcome, planDelay) => {
    window.__wheelLog = []
    window.addEventListener('wheel', (e) => {
      window.__wheelLog.push({
        target: e.target.tagName + (e.target.className ? '.' + String(e.target.className).split(' ')[0] : ''),
        x: e.clientX,
        y: e.clientY,
        deltaY: e.deltaY,
        prevented: false,
      })
    }, { capture: true, passive: true })
    window.addEventListener('wheel', (e) => {
      const last = window.__wheelLog[window.__wheelLog.length - 1]
      if (last) last.prevented = e.defaultPrevented
    }, { capture: false, passive: true })

    if (welcome) {
      const realFetch = window.fetch.bind(window)
      window.fetch = async (input, init = {}) => {
        const u = typeof input === 'string' ? input : input && input.url ? input.url : ''
        const bodyStr =
          typeof init.body === 'string' ? init.body
          : input && typeof input.body === 'string' ? input.body : ''
        if (u.includes('/api/generate-roadmap')) {
          let parsed = {}
          try { parsed = JSON.parse(bodyStr) } catch {}
          if (parsed.mode === 'welcome') {
            return new Response(JSON.stringify({ welcomeMessage: welcome }), {
              status: 200, headers: { 'Content-Type': 'application/json' },
            })
          }
          if (parsed.mode === 'multi') {
            await new Promise((r) => setTimeout(r, planDelay))
            return new Response(JSON.stringify({
              field: 'Web Development',
              futurePath: [],
              steps: [{ name: 'HTML basics', why: 'w', whyMatters: 'w', time: 't', resourceTitle: 'r', resourceUrl: '', task: 't' }],
            }), { status: 200, headers: { 'Content-Type': 'application/json' } })
          }
        }
        return realFetch(input, init)
      }
    }
  }, welcomeMsg, PLAN_DELAY_MS)

  await page.goto(url, { waitUntil: 'load', timeout: 30000 })

  if (welcomeMsg) {
    await page.waitForSelector('.cta', { timeout: 15000 })
    await sleep(500)
    await page.click('.cta')
    await sleep(800)
    for (let i = 0; i < 5; i++) {
      await page.waitForSelector('.quiz-card:not([disabled])', { timeout: 15000 })
      await page.click('.quiz-card')
      await sleep(650)
    }
    await page.waitForSelector('#s-ob .quiz-card:not([disabled])', { timeout: 15000 })
    await sleep(400)
    await page.click('#s-ob .quiz-card')
    await page.waitForSelector('.ai-welcome-text', { timeout: 15000 })
    await sleep(1000)
  }

  const measure = async () => page.evaluate(() => ({
    scrollY: window.scrollY,
    activeScreen: (document.querySelector('.screen.active') || {}).id || '(plain page)',
  }))

  // --- Test 1: programmatic instant jump ---
  const programmatic = await page.evaluate(() => {
    window.scrollTo({ top: 99999, behavior: 'instant' })
    const y = window.scrollY
    window.scrollTo({ top: 0, behavior: 'instant' })
    return y
  })

  // --- Test 2: real mouse wheel at centre ---
  await page.mouse.move(viewport.width / 2, viewport.height / 2)
  await page.mouse.wheel(0, 1200)
  await sleep(600)
  const wheelCenter = { ...(await measure()), log: await page.evaluate(() => window.__wheelLog) }

  // --- Test 3: real mouse wheel near top-left corner ---
  await page.evaluate(() => { window.__wheelLog = [] })
  await page.mouse.move(8, 8)
  await page.mouse.wheel(0, 1200)
  await sleep(600)
  const wheelCorner = { ...(await measure()), log: await page.evaluate(() => window.__wheelLog) }

  // --- Test 4: CDP synthesizeScrollGesture (real-user-like scroll) ---
  const client = await page.createCDPSession()
  await client.send('Input.synthesizeScrollGesture', {
    x: Math.floor(viewport.width / 2),
    y: Math.floor(viewport.height / 2),
    xDistance: 0,
    yDistance: -400,
    speed: 800,
  })
  await sleep(700)
  const synth = await measure()

  await page.screenshot({ path: `repro/probe-${label}.png` })
  console.log(`\n=== ${label} ===`)
  console.log(`  programmaticJump : ${programmatic}px`)
  console.log(`  wheelCenter      : y=${wheelCenter.scrollY}px  screen=${wheelCenter.activeScreen}`)
  console.log(`                     wheel=${JSON.stringify(wheelCenter.log.slice(0, 3))}`)
  console.log(`  wheelCorner      : y=${wheelCorner.scrollY}px  screen=${wheelCorner.activeScreen}`)
  console.log(`                     wheel=${JSON.stringify(wheelCorner.log.slice(0, 3))}`)
  console.log(`  synthGesture     : y=${synth.scrollY}px  screen=${synth.activeScreen}`)
  await page.close()
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: process.env.HEADED === '1' ? false : 'new',
  args: ['--no-first-run', '--disable-gpu'],
})

const jobs = [
  { label: 'control-desktop', url: CONTROL, viewport: { width: 1280, height: 800 } },
  { label: 'app-desktop-long', url: APP, viewport: { width: 1280, height: 800 }, welcomeMsg: makeWelcome(2400) },
  { label: 'app-desktop-short', url: APP, viewport: { width: 1280, height: 800 }, welcomeMsg: makeWelcome(300) },
  { label: 'app-mobile-long', url: APP, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, welcomeMsg: makeWelcome(1200) },
]
const only = process.argv[2]
for (const j of jobs) {
  if (only && !j.label.includes(only)) continue
  try {
    await probe(browser, j)
  } catch (e) {
    console.log(`[${j.label}] FAILED:`, String(e).slice(0, 250))
  }
}

await browser.close()