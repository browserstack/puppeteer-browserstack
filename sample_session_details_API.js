'use strict';
const { strict } = require('once');
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
(async () => {
    const caps = {
        'browserName': 'chrome',
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
    `wss://cdp.browserstack.com?caps=${encodeURIComponent(JSON.stringify(caps))}`,
    });

    /* 
    *  BrowserStack specific code ends here
    */
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
    /* 
    *  The following part of the code uses the getSessionDetails API to get all the relevant details about the running playwright session.
    *  You can use all these details after your test has completed, to fetch logs or use any other Automate REST APIs
    */
    const resp = await JSON.parse(await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'getSessionDetails'})}`));
    const jsonObj = await JSON.parse(resp);
    console.log(jsonObj.hashed_id);  // This gives the session ID of the running session
    console.log(jsonObj);  // This prints the entire JSON response. You can use any/all of the response attributes the way you like.
    
    await browser.close();
})();
