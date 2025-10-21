//loading required files
const { driver } = require('@wdio/globals');
const { readFileSync } = require('fs');
const path = require('path');
const browserStackConfig = require('./browserstack.config');

// --- Define Spec file sets
const cordovaSpecs = [
  '../specs/ReadyPage.cordova.js'

];
const mobileBrowserSpecs = [
  '../specs/DiscussPage.browser.js',
    '../specs/FAQPage.browser.js',
    '../specs/PrivacyPage.browser.js',
    '../specs/ReadyPage.browser.js',
    '../specs/TermsPage.browser.js',
    '../specs/TopNavigation.browser.js',
    '../specs/TopicsPage.browser.js',
    '../specs/HowItWorks.browser.js',
    '../specs/FooterLinks.browser.js',
    '../specs/SignInPage.browser.js',
    '../specs/BallotPage.browser.js',
    '../specs/CandidatesPage.browser.js',
    '../specs/VerifyCount.browser.js',
    '../specs/WhosRunningForOffice.browser.js',
];
const desktopBrowserSpecs = [
    '../specs/DiscussPage.browser.js',
    '../specs/FAQPage.browser.js',
    '../specs/PrivacyPage.browser.js',
    '../specs/ReadyPage.browser.js',
    '../specs/TermsPage.browser.js',
    '../specs/TopNavigation.browser.js',
    '../specs/TopicsPage.browser.js',
    '../specs/HowItWorks.browser.js',
    '../specs/FooterLinks.browser.js',
    '../specs/SignInPage.browser.js',
    '../specs/BallotPage.browser.js',
    '../specs/CandidatesPage.browser.js',
    '../specs/VerifyCount.browser.js',
    '../specs/WhosRunningForOffice.browser.js',

];


// --- Read capabilities from separate JSON files ---
//cordova capabilities
let cordovaCapabilities = [];
try {
  const data = readFileSync(path.join(__dirname, '../capabilities/cordova_mobile_devices.json'), { encoding: 'utf8' });
  cordovaCapabilities = JSON.parse(data);
  cordovaCapabilities.forEach(cap => {
    // read app urls from browserstack.config, Check the platform and assign the correct URL
    // inside the appium:options object in the above file
    if (cap.platformName && cap.platformName.toLowerCase() === 'android') {
      cap['appium:options'].app = browserStackConfig.BROWSERSTACK_APK_URL;
    } else if (cap.platformName && cap.platformName.toLowerCase() === 'ios') {
      cap['appium:options'].app = browserStackConfig.BROWSERSTACK_IPA_URL;
    }
  });
} catch (error) {
  console.error("Failed to read mobile app testing capabilities.json:", error);
}

//mobileBrowser  capabilities
let mobileBrowserCapabilities = [];
try {
  const data = readFileSync(path.join(__dirname, '../capabilities/browser_mobile_devices.json'), { encoding: 'utf8' });
  mobileBrowserCapabilities = JSON.parse(data);
 // console.log('Loaded Mobile Browser Capabilities:', mobileBrowserCapabilities);
} catch (error) {
  console.error("Failed to read mobile browser testing capabilities.json:", error);
}

//desktopBrowser capabilities
let desktopBrowserCapabilities = [];
try {
  desktopBrowserCapabilities = require('../capabilities/browser_desktop.json');
} catch (error) {
  console.error("Failed to read desktop browser capabilities.json:", error);
}


// --- Select capabilities and assign specs based on RUN_TYPE ---
let selectedCapabilities = [];
console.log('RUN_TYPE:', process.env.RUN_TYPE);

cordovaCapabilities.forEach(cap => cap.specs = cordovaSpecs);
mobileBrowserCapabilities.forEach(cap => cap.specs = mobileBrowserSpecs);
desktopBrowserCapabilities.forEach(cap => cap.specs = desktopBrowserSpecs);

switch (process.env.RUN_TYPE) {
  case 'cordova':
    selectedCapabilities = cordovaCapabilities;
    break;
  case 'browser-mobile':
    selectedCapabilities = mobileBrowserCapabilities;
    break;
  case 'wdio':
  case 'browser-desktop':
    selectedCapabilities = desktopBrowserCapabilities;
    break;
  case 'all':
  default:
    selectedCapabilities = [...cordovaCapabilities, ...mobileBrowserCapabilities, ...desktopBrowserCapabilities];
    break;
}

// --- Apply common BrowserStack options ---
const date = new Date();
const dateForDisplay = date.toDateString();
const buildName = `${browserStackConfig.NAME}: ${dateForDisplay}`;

const commonOptions = {
    buildName,
    debug: 'true',
    gpsLocation: '37.804363,-122.271111',
    idleTimeout: '300',
    maskCommands: 'setValues, getValues, setCookies, getCookies',
    video: 'true',
};

selectedCapabilities.forEach((capability) => {
    capability['bstack:options'] = {
        ...capability['bstack:options'],
        ...commonOptions,
    };
});


// --- WebdriverIO Configuration Object ---
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

  // IMPORTANT: The global 'specs' array must be empty here,
  // as specs are assigned to each capability object.
  specs: [],
  capabilities: selectedCapabilities,
  // onPrepare hook to display all the capabilities selected
  onPrepare: function (config, capabilities) {
    console.log('Final Selected Capabilities for Test Run:');
    if (Array.isArray(capabilities)) {
      capabilities.forEach((cap, index) => {
        console.log(`--- Capability ${index + 1} ---`);
        // Use JSON.stringify for a formatted view of the object
        console.log(JSON.stringify(cap, null, 2));
        console.log(`-----------------------`);
      });
    } else {
      console.log('Capabilities object is not an array:', capabilities);
    }
  },

  maxInstances: 1,
  exclude: [],
  logLevel: 'error',
  coloredLogs: true,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: [['browserstack']],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  // Custom command
  before: function before () {
    driver.addCommand('findAndClick', async function findAndClick () {
      await this.waitForExist();
      await this.moveTo();
      await this.click();
    }, true);
  },
};
