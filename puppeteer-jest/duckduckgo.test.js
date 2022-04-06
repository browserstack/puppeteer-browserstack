// import 'expect-puppeteer'

const { Browser } = require("puppeteer");

describe("DuckDuckGo", () => {
  beforeAll(async () => {
    await page.goto('https://www.duckduckgo.com')
  })
  it('title should match BrowserStack at DuckDuckGo', async () => {
    const element = await page.$('[name="q"]');
    await element.click();
    await element.type('BrowserStack');
    await element.press('Enter');
    await page.waitForNavigation();
    try {
      expect(await page.title()).toBe('BrowserStack at DuckDuckGo');
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Test assertion passed'}})}`);
    } catch {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Test assertion failed'}})}`);
    }
  })
})
