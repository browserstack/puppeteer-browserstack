const puppeteer = require('puppeteer');

describe('BrowserStack Local', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // browserstackLocal: true in browserstack.yml starts the Local tunnel,
    // so bs-local.com resolves to your local machine inside the session.
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it('loads the local page over the BrowserStack Local tunnel', async () => {
    await page.goto('http://bs-local.com:45454');
    expect(await page.title()).toBe('BrowserStack Local');
  });
});
