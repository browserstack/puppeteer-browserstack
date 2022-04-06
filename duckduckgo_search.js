'use strict';
const { strict } = require('once');
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
(async () => {
    const caps = {
        'browser': 'chrome',  // You can choose `chrome`, `edge` or `firefox` in this capability
        'browser_version': 'latest',  // We support v83 and above. You can choose `latest`, `latest-beta`, `latest-1`, `latest-2` and so on, in this capability
        'os': 'os x',
        'os_version': 'big sur',
        'build': 'puppeteer-build-1',
        'name': 'My first Puppeteer test',  // The name of your test and build. See browserstack.com/docs/automate/puppeteer/organize tests for more details
        'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME',
        'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY'
    };
    const browser = await puppeteer.connect({
    browserWSEndpoint:
    `wss://cdp.browserstack.com/puppeteer?caps=${encodeURIComponent(JSON.stringify(caps))}`,  // The BrowserStack CDP endpoint gives you a `browser` instance based on the `caps` that you specified
    });

    /* 
    *  The BrowserStack specific code ends here. Following this line is your test script.
    *  Here, we have a simple script that opens duckduckgo.com, searches for the word BrowserStack and asserts the result.
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
    await browser.close();  // At the end of each of your tests, you must close the browser so that BrowserStack knows when to end the session.
})();
