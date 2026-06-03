# Puppeteer (Jest) with BrowserStack

Run your Puppeteer tests with the Jest test runner on the BrowserStack
infrastructure using the [BrowserStack Node SDK](https://www.browserstack.com/docs/automate/selenium/sdk-overview).
The SDK intercepts Puppeteer's browser launch and routes each session to the
BrowserStack cloud — no changes to your test logic are required.

## Prerequisites

- A BrowserStack account ([sign up](https://www.browserstack.com/users/sign_up)).
- Your BrowserStack `userName` and `accessKey` from your
  [Account Settings](https://www.browserstack.com/accounts/settings) page.
- Node.js (>= 14) and npm installed.

## Setup

1. Clone this repository and move into this sample directory:

   ```bash
   git clone https://github.com/browserstack/puppeteer-browserstack.git
   cd puppeteer-browserstack/puppeteer-jest-sdk
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Provide your BrowserStack credentials. Either set them as environment
   variables:

   ```bash
   export BROWSERSTACK_USERNAME="YOUR_USERNAME"
   export BROWSERSTACK_ACCESS_KEY="YOUR_ACCESS_KEY"
   ```

   or edit `browserstack.yml` and replace `YOUR_USERNAME` and
   `YOUR_ACCESS_KEY` with your credentials.

## Run Sample Test

```bash
npx browserstack-node-sdk jest sample.test.js
```

## Run Local Test

```bash
npx browserstack-node-sdk jest local.test.js
```

The local test loads `http://bs-local.com:45454`. `browserstackLocal: true` in
`browserstack.yml` starts the BrowserStack Local tunnel automatically. Make sure
a server is serving a page titled `BrowserStack Local` on port `45454` of your
local machine before running this test.

## Notes

- View your test runs, sessions, logs, and video recordings on the
  [BrowserStack Automate dashboard](https://automate.browserstack.com/).
- To run all tests at once: `npx browserstack-node-sdk jest`.
