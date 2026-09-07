import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function probe(browser, file, label, bodyOverflowX) {
  const page = await browser.newPage()
  await page.setViewport({ width:1280, height:800 })
  await page.goto('file:///E:/YourNext/repro/' + file, { waitUntil:'load' })

  if (bodyOverflowX) {
    await page.evaluate((v) => document.body.style.setProperty('overflow-x', v), bodyOverflowX)
  }

  const measured = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    docScrollHeight: document.documentElement.scrollHeight,
    bodyScrollHeight: document.body.scrollHeight,
    mainScrollHeight: (document.querySelector('.screen.active') || document.querySelector('.control'))?.scrollHeight ?? null,
  }))

  const scrollToNow = await page.evaluate(() => {
    window.scrollTo(0,300)
    const y = window.scrollY
    window.scrollTo(0,0)
    return y
  })
  await sleep(300)
  const scrollToSettled = await page.evaluate(() => {
    const y = window.scrollY
    window.scrollTo(0,0)
    return y
  })
  await sleep(300)

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.body.style.scrollBehavior = 'auto'
  })
  await page.mouse.click(640,100)
  await page.mouse.move(640,400)
  await page.mouse.wheel(0,500)
  await sleep(800)
  const wheelDownSettled = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0,-500)
  await sleep(800)
  const wheelUpSettled = await page.evaluate(() => window.scrollY)

  console.log(JSON.stringify({
    label,
    measured,
    scrollTo: { now:scrollToNow, settled:scrollToSettled },
    wheel: { downSettled:wheelDownSettled, upSettled:wheelUpSettled },
  }, null,  2))

  await page.close()
}

const browser = await puppeteer.launch({
  executablePath:CHROME,
  headless:'new',
  args:['--no-first-run','--disable-gpu'],
})

await probe(browser, 'control.html', 'CONTROL: plain tall content', null)
await probe(browser, 'scroll-test.html', 'A: loading-screen structure, body overflow-x hidden', null)
await probe(browser, 'scroll-test.html', 'B: loading-screen structure, no body overflow-x', 'visible')

await browser.close()