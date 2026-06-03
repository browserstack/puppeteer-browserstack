const puppeteer = require('puppeteer');

describe('BrowserStack Sample', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // The BrowserStack Node SDK intercepts puppeteer.launch() and routes
    // the session to the BrowserStack cloud using browserstack.yml.
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it('adds the first product to the cart', async () => {
    await page.goto('https://bstackdemo.com/');

    // Read the first product's name (XPath //*[@id="1"]/p) — modern Puppeteer
    // uses the ::-p-xpath() locator; page.$x() was removed in Puppeteer v22.
    const productEl = await page.waitForSelector('::-p-xpath(//*[@id="1"]/p)');
    const productText = await productEl.evaluate((el) => el.textContent);

    // Click its "Add to cart" button (XPath //*[@id="1"]/div[4]).
    const addToCartBtn = await page.waitForSelector('::-p-xpath(//*[@id="1"]/div[4])');
    await addToCartBtn.click();

    // Wait for the cart pane to open.
    await page.waitForSelector('.float-cart__content');

    // Read the product name shown in the cart.
    const cartEl = await page.waitForSelector(
      '::-p-xpath(//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/div[3]/p[1])'
    );
    const productCartText = await cartEl.evaluate((el) => el.textContent);

    expect(productCartText).toBe(productText);
  });
});
