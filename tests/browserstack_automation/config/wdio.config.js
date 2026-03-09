
import { driver } from '@wdio/globals';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { browserStackConfig } from './browserstack.config.js';
import { uploadAppsToBrowserStack } from '../utils/uploadAndConfigureApps.js';

// ESM equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//import data files
import cordovaData from '../capabilities/cordova_mobile_devices.json' with { type: 'json' };
import mobileBrowserData from '../capabilities/browser_mobile_devices.json' with { type: 'json' };
import desktopBrowserData from '../capabilities/browser_desktop.json' with { type: 'json' };

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
    '../specs/CandidateDetailsPage.browser.js'
];

const desktopBrowserSpecs = [
<<<<<<< HEAD
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
     '../specs/CandidateDetailsPage.browser.js'
=======
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
    '../specs/CandidateDetailsPage.browser.js'

>>>>>>> aebcdcf2c (Nadia_Feb24 V1.1 regression fixes)
];

//Process Capabilities for each platform and assign specs
// Process Cordova Capabilities (Inject App URLs)
const cordovaCapabilities = cordovaData.map(cap => {
    const platform = cap.platformName?.toLowerCase();
    return {
        ...cap,
        'appium:options': {
            ...cap['appium:options'],
            app: platform === 'android'
                ? browserStackConfig.BROWSERSTACK_APK_URL
                : browserStackConfig.BROWSERSTACK_IPA_URL
        },
        specs: cordovaSpecs
    };
});

//Process mobile Browser Capabilities
const mobileBrowserCapabilities = mobileBrowserData.map(cap => ({
    ...cap,
    specs: mobileBrowserSpecs
}));

//Process desktop Capabilities
const desktopBrowserCapabilities = desktopBrowserData.map(cap => ({
    ...cap,
    specs: desktopBrowserSpecs
}));

// --- Select capabilities and assign specs based on RUN_TYPE ---
let selectedCapabilities = [];
console.log('RUN_TYPE:', process.env.RUN_TYPE);

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

  // IMPORTANT: The global 'specs' array must be empty here,
  // as specs are assigned to each capability object.
  specs: [],
  capabilities: selectedCapabilities,
  // onPrepare hook to display all the capabilities selected
  onPrepare: async function (config, capabilities) {
    console.log('========== onPrepare - Starting setup for BrowserStack ==========');

    //  Step 1: Upload apps only if required
    if (process.env.RUN_TYPE !== 'cordova' && process.env.RUN_TYPE !== 'all') {
      console.log(`Skipping app upload (RUN_TYPE = ${process.env.RUN_TYPE})`);
    } else {
      try {
        const { apkUrl, ipaUrl } = await uploadAppsToBrowserStack();
        console.log('Apps uploaded successfully:');
        if (apkUrl) console.log('  APK URL:', apkUrl);
        if (ipaUrl) console.log('  IPA URL:', ipaUrl);

        // Step 2: Update cordova capabilities with new URLs & BrowserStack credentials
        cordovaCapabilities.forEach(cap => {
          if (!cap['appium:options']) cap['appium:options'] = {};
          if (cap.platformName.toLowerCase() === 'android') cap['appium:options'].app = apkUrl;
          if (cap.platformName.toLowerCase() === 'ios') cap['appium:options'].app = ipaUrl;

          cap['bstack:options'] = {
            ...cap['bstack:options'],
            userName: browserStackConfig.BROWSERSTACK_USER,
            accessKey: browserStackConfig.BROWSERSTACK_KEY,
            appiumVersion: '2.0.1',
            ...commonOptions,
          };
        });
      } catch (err) {
        console.error(' Error during app upload in onPrepare:', err.message);
      }
    }

    // Step 3: Print final selected capabilities after any modifications
    console.log('\n========== Final Selected Capabilities for Test Run ==========');
    if (Array.isArray(capabilities)) {
      capabilities.forEach((cap, index) => {
        console.log(`--- Capability ${index + 1} ---`);
        console.log(JSON.stringify(cap, null, 2));
        console.log('-----------------------------');
      });
    } else {
      console.log('Capabilities object is not an array:', capabilities);
    }

    console.log('========== onPrepare Completed ==========');
  },

  maxInstances: 1,
  exclude: [],
  outputDir: path.join(__dirname, '../qalogs'),
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
