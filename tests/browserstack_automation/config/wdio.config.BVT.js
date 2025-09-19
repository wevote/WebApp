import { driver } from '@wdio/globals';
import { readFileSync } from 'fs';
import browserCapabilities from '../capabilities/browser_bvt.json' with { type: 'json' };

let mobileCapabilities = [];


const capabilities = [...browserCapabilities];

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `BVT: ${dateForDisplay}`;

// https://webdriver.io/docs/configurationfile

export const config = {
  user: process.env.BROWSERSTACK_USERNAME, // Browserstack user name and password are configured in the github secrets (github repository-> settings-> secrets and variables -> actions)
  key: process.env.BROWSERSTACK_ACCESS_KEY,
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
    '../specs/FAQPage.js',
    '../specs/FooterLinks.js',
    '../specs/TopNavigation.js',
    '../specs/CandidatesPage.js',
    '../specs/ReadyPage.js',
    '../specs/SignInPage.js',
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
  baseUrl: 'https://quality.wevote.us/ready',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: [['browserstack']],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
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

config.capabilities.forEach((device) => {
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
