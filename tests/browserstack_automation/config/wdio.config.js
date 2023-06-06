const { readFileSync } = require('fs');
const browserStackConfig = require('./browserstack.config');
const browserCapabilities = require('../capabilities/browser.json');

let mobileCapabilities = [];

try {
  const data = readFileSync('./tests/browserstack_automation/capabilities/mobile.json', { encoding: 'utf8' });
  mobileCapabilities = JSON.parse(data);
} catch (error) {
  // Run `npm run wdio:setup`
}

const capabilities = [...browserCapabilities, ...mobileCapabilities];

const baseConfig = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  injectGlobals: false,
  updateJob: true,
  specs: [
    '../specs/ReadyPage.js',
  ],
  exclude: [],
  logLevel: 'warn',
  coloredLogs: true,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  hostname: 'hub.browserstack.com',
  services: [['browserstack']],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.NAME}: ${dateForDisplay}`;

const parallelConfig = {
  capabilities,
  commonCapabilities: {
    'bstack:options': {
      buildName,
    },
  },
  maxInstances: 2,
};

/* eslint-disable import/prefer-default-export */
// See https://webdriver.io/docs/configurationfile

export const config = {
  ...baseConfig,
  ...parallelConfig,
};

config.capabilities.forEach((capability) => {
  const device = capability;
  const keys = Object.keys(device);
  keys.forEach((key) => {
    if (key in config.commonCapabilities) {
      device[key] = {
        ...device[key],
        ...config.commonCapabilities[key],
      };
    }
  });
});
