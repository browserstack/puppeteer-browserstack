'use strict';
const { strict } = require('once');
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
(async () => {
    const caps = {
        'browser': 'chrome',
        'browser_version': 'latest',
        'os': 'os x',
        'os_version': 'big sur',
        'build': 'puppeteer-build-1',
        'name': 'My first Puppeteer test',
        'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME',
        'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY'
    };
    const browser = await puppeteer.connect({
    browserWSEndpoint:
    `wss://cdp.browserstack.com/puppeteer?caps=${encodeURIComponent(JSON.stringify(caps))}`,
    });

    /* 
    *  BrowserStack specific code ends here
    */
    const page = await browser.newPage();

    await page.goto('https://www.duckduckgo.com');
    const element = await page.$('[name="q"]');
    await element.click();
    await element.type('BrowserStack');
    await element.press('Enter');
    const title = await page.title('');
    console.log(title);
    try {
        expect(title).toEqual("BrowserStack at DuckDuckGo", 'Expected page title is incorrect!');
        // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matched'}})}`);
    } catch {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
    }
    await browser.close();
})();
