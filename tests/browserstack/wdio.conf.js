// Can not set browser.geoLocation and browser.local simultaneously
const browserStackConfig = require('./browserstack.config');

const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './specs/readyMainTest.js',
  ],
  twitterUserName: browserStackConfig.TWITTER_USER_NAME,
  twitterPassword: browserStackConfig.TWITTER_PASSWORD,
  exclude: [],
  capabilities: [
    {
      name: 'readyMainTest: Samsung Galaxy S20 Plus 10.0',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy S20 Plus',
      os_version: '10.0',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      browserName: 'Android',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.appium_version': '1.17.0',
      'browserstack.local': false,
      isAndroid: true,
      isCordovaFromAppStore: true,
      isIOS: false,
      isMobileScreenSize: true,
    },
    {
      name: 'readyMainTest: Samsung Galaxy S20 Ultra 10.0',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy S20 Ultra',
      os_version: '10.0',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      browserName: 'Android',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.appium_version': '1.17.0',
      'browserstack.local': false,
      isAndroid: true,
      isCordovaFromAppStore: true,
      isIOS: false,
      isMobileScreenSize: true,
    },
    {
      name: 'readyMainTest: Samsung Galaxy S8 Plus 9.0',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy S8 Plus',
      os_version: '9.0',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      browserName: 'Android',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.appium_version': '1.17.0',
      'browserstack.local': false,
      isAndroid: true,
      isCordovaFromAppStore: true,
      isIOS: false,
      isMobileScreenSize: true,
    },
    ],
  webviewConnectTimeout: 90000,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  reporters: ['concise'],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 360000,
  },
}
