const { driver } = require('@wdio/globals');
const { readFileSync } = require('fs');
const browserStackConfig = require('./browserstack.config');
const browserCapabilities = require('../capabilities/browser.json');
const projpath = require('path');
const androidAppPath = projpath.join(process.cwd(),"/apps/WeVoteV2.5.0.0Sept27.apk");

let mobileCapabilities = [];

try {
  const data = readFileSync('./tests/browserstack_automation/capabilities/mobile.json', { encoding: 'utf8' });
  mobileCapabilities = JSON.parse(data);
} catch (error) {

  // Run `npm run wdio:setup`
}

const capabilities = [...mobileCapabilities];

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.NAME}: ${dateForDisplay}`;

// https://webdriver.io/docs/configurationfile

module.exports.config = {
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
   /* '../specs/DiscussPage.js',
    '../specs/FAQPage.js',
    '../specs/PrivacyPage.js',
    '../specs/ReadyPage.js',
    '../specs/TermsPage.js',
    '../specs/TopNavigation.js',
    '../specs/TopicsPage.js',
    '../specs/HowItWorks.js',
    '../specs/FooterLinks.js',
    '../specs/SignInPage.js',

    '../specs/BallotPage.js',
    '../specs/CandidatesPage.js',

    '../specs/WhosRunningForOffice.js',
    '../specs/ReadyPageMobileApp.js',
    '../specs/TestLogin.js',*/
    '../specs/ReadyPageMobileBrowserTest.js',
  ],

  capabilities:[
    {
      /*"platformName": "Android",
    "appium:platformVersion": "12.0",
    "appium:deviceName": "Samsung Galaxy S22",
    //"appium:app": "bs://2bb0853b76891d207035ae99c1dcf7d2b12f3254",
    "browserName": "chrome",
   "appium:automationName": "UIAutomator2"*/
   browserName: 'chrome',
    'bstack:options': {
      deviceName: 'Samsung Galaxy S22',
      osVersion: '12.0',
      platformName: 'android'
    }
    }],
  commonCapabilities:{
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
    }

    
  },
  maxInstances: 1,
  exclude: [],
  logLevel: 'error',
  coloredLogs: true,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 999999999,
  connectionRetryCount: 1,
  port: 443,
  services: [['browserstack'],['appium']],
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

module.exports.config.capabilities.forEach((capability) => {
  const device = capability;
  const keys = Object.keys(device);
  keys.forEach((key) => {
    if (key in module.exports.config.commonCapabilities) {
      device[key] = {
        ...device[key],
        ...module.exports.config.commonCapabilities[key],
      };
    }
  });
});
