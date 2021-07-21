/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  rootDir: '.',
    testTimeout: 20000,
    testMatch: [
      '<rootDir>/*.test.js'
    ],
    "preset": "jest-puppeteer"
};
