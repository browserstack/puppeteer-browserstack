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

    // Read the first product's name (mirrors XPath //*[@id="1"]/p).
    const [productEl] = await page.$x('//*[@id="1"]/p');
    const productText = await page.evaluate((el) => el.textContent, productEl);

    // Click its "Add to cart" button (mirrors XPath //*[@id="1"]/div[4]).
    const [addToCartBtn] = await page.$x('//*[@id="1"]/div[4]');
    await addToCartBtn.click();

    // Wait for the cart pane to open.
    await page.waitForSelector('.float-cart__content');

    // Read the product name shown in the cart.
    const [cartEl] = await page.$x(
      '//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/div[3]/p[1]'
    );
    const productCartText = await page.evaluate((el) => el.textContent, cartEl);

    expect(productCartText).toBe(productText);
  });
});
