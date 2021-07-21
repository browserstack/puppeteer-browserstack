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
        'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_ACCESS_KEY',
        'browserstack.local': 'true'  // You have to ensure that you have started the BrowserStackLocal binary in your system and you have seen '[SUCCESS] You can now access your local server(s) in our remote browser' in the terminal
    };
    const browser = await puppeteer.connect({
    browserWSEndpoint:
    `ws://cdp.browserstack.com?caps=${encodeURIComponent(JSON.stringify(caps))}`,
    });

    /* 
    *  BrowserStack specific code ends here.
    *  You have to ensure that BrowserStackLocal binary is running on your system before invoking this script.
    */
    const page = await browser.newPage();
    await page.goto('http://localhost:45454');
    const title = await page.title('');
    console.log(title);
    try {
        expect(title).to.equal("BrowserStack Local", 'Expected page title is incorrect!');
        // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Local is up and running'}})}`);
    } catch {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'BrowserStack Local binary is not running'}})}`);
    }
    await browser.close();
})();

//  After the end of the script, ensure to stop the BrowserStackLocal binary that had been started before invoking this script.