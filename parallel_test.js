const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const main = async (cap) => {
    console.log("Starting test -->", cap['name'])
    
    cap['browserstack.username'] = process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME';
    cap['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY';

    const browser = await puppeteer.connect({
      browserWSEndpoint:`wss://cdp.browserstack.com/puppeteer?caps=${encodeURIComponent(JSON.stringify(cap))}`,
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com/ncr');
    const element = await page.$('[aria-label="Search"]');
    await element.click();
    await element.type('BrowserStack');
    await element.press('Enter');
    const title = await page.title('');
    console.log(title);
    try {
        expect(title).to.equal("BrowserStack - Google Search", 'Expected page title is incorrect!');
        // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matched'}})}`);
      } catch {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
      }
    await browser.close();
};

//  The following capabilities array contains the list of os/browser environments where you want to run your tests. You can choose to alter this list according to your needs
const capabilities = [
{
  'browser': 'chrome',
  'browser_version': 'latest',
  'os': 'osx',
  'os_version': 'catalina',
  'name': 'Chrome latest on Catalina',
  'build': 'puppeteer-build-2'
},
{
  'browser': 'firefox',
  'browser_version': 'latest',
  'os': 'osx',
  'os_version': 'catalina',
  'name': 'Firefox latest on Catalina',
  'build': 'puppeteer-build-2'
},
{
  'browser': 'edge',
  'browser_version': 'latest',
  'os': 'osx',
  'os_version': 'catalina',
  'name': 'Edge latest on Catalina',
  'build': 'puppeteer-build-2'
},
{
  'browser': 'chrome',
  'browser_version': 'latest-1',
  'os': 'Windows',
  'os_version': '10',
  'name': 'Chrome latest-1 on Win10',
  'build': 'puppeteer-build-2'
},
{
  'browser': 'firefox',
  'browser_version': 'latest-beta',
  'os': 'Windows',
  'os_version': '10',
  'name': 'Firefox beta on Win10',
  'build': 'puppeteer-build-2'
},
{
  'browser': 'edge',
  'browser_version': 'latest',
  'os': 'Windows',
  'os_version': '10',
  'name': 'Edge latest on Win10',
  'build': 'puppeteer-build-2'
}]

//  The following code loops through the capabilities array defined above and runs your code against each environment that you have specified
capabilities.forEach(async (cap) => {
  await main(cap);
});
