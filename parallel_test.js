const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const main = async (cap) => {
    console.log("Starting test -->", cap['name'])
    
    cap['browserstack.username'] = process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME';
    cap['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY';

    const browser = await puppeteer.connect({
      browserWSEndpoint:`wss://cdp.browserstack.com/puppeteer?caps=${encodeURIComponent(JSON.stringify(cap))}`,  // The BrowserStack CDP endpoint gives you a `browser` instance based on the `caps` that you specified
    });
    /* 
    *  The BrowserStack specific code ends here. Following this line is your test script.
    *  Here, we have a simple script that opens google.com, searches for the word BrowserStack and asserts the result.
    */
    const page = await browser.newPage();
    await page.goto('https://www.duckduckgo.com');
    const element = await page.$('[name="q"]');
    await element.click();
    await element.type('BrowserStack');
    await element.press('Enter');
    await page.waitForNavigation();
    const title = await page.title('');
    console.log(title);
    try {
        expect(title).to.equal("BrowserStack at DuckDuckGo", 'Expected page title is incorrect!');
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
  'browser_version': 'latest',  // We support chrome v72 and above. You can choose `latest`, `latest-beta`, `latest-1`, `latest-2` and so on, in this capability
  'os': 'osx',
  'os_version': 'catalina',
  'name': 'Chrome latest on Catalina',  // The name of your test and build. See browserstack.com/docs/automate/puppeteer/organize-tests for more details
  'build': 'puppeteer-build-2'
},
{
  'browser': 'firefox',
  'browser_version': 'latest',  // We support firefox v86 and above. You can choose `latest`, `latest-beta`, `latest-1`, `latest-2` and so on, in this capability
  'os': 'osx',
  'os_version': 'catalina',
  'name': 'Firefox latest on Catalina',
  'build': 'puppeteer-build-2'
},
{
  'browser': 'edge',
  'browser_version': 'latest',  // We support edge v80 and above. You can choose `latest`, `latest-beta`, `latest-1`, `latest-2` and so on, in this capability
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

//  The following code loops through the capabilities array defined above and runs your code against each environment that you have specified in parallel
capabilities.forEach(async (cap) => {
  await main(cap);
});
