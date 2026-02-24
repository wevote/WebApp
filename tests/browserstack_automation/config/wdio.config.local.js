import { driver } from '@wdio/globals';
import { readFileSync } from 'fs';
import { browserStackConfig } from './browserstack.config.js';
import browserCapabilities from '../capabilities/browser.json' with { type: 'json' };

let mobileCapabilities = [];

try {
  const data = readFileSync('./tests/browserstack_automation/capabilities/mobile.json', { encoding: 'utf8' });
  mobileCapabilities = JSON.parse(data);
} catch (error) {
  // Run `npm run wdio:setup`
}

const capabilities = [...browserCapabilities, ...mobileCapabilities];

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.NAME}: ${dateForDisplay}`;

// https://webdriver.io/docs/configurationfile

export const config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  injectGlobals: false,
  updateJob: true,
  reporters: [
    [
      'spec',
      {
        onlyFailures: true,
      },
    ],
  ],
  specs: [
    '../specs/DiscussPage.browser.js',
    '../specs/FAQPage.browser.js',
    '../specs/PrivacyPage.browser.js',
    '../specs/ReadyPage.js',
    '../specs/TermsPage.browser.js',
    '../specs/TopNavigation.browser.js',
  ],
  capabilities,
  commonCapabilities: {
    'bstack:options': {
      buildName,
      debug: 'true',
      // geoLocation is only available under Enterprise plans
      // geoLocation: 'US-CA',
      // gpsLocation is only available under Paid plans
      // Oakland, CA, USA
      gpsLocation: '37.804363,-122.271111',
      maskCommands: 'setValues, getValues, setCookies, getCookies',
      video: 'true',
    },
  },
  maxInstances: 1,
  exclude: [],
  logLevel: 'error',
  coloredLogs: true,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: [['browserstack',{browserstackLocal: true}]],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 100000,
  },
  // https://webdriver.io/docs/customcommands#examples
  before: function before () {
    driver.addCommand('findAndClick', async function findAndClick () {
      await this.waitForExist();
      await this.moveTo();
      await this.click();
    }, true);
  },
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
