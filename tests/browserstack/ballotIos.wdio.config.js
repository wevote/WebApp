const browserStackConfig = require('./browserstack.config');
const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './tests/browserstack/specs/ballotMainTest.js',
  ],
  exclude: [],
  logLevel: 'trace',
  twitterUserName: browserStackConfig.TWITTER_USER_NAME,
  twitterPassword: browserStackConfig.TWITTER_PASSWORD,
  capabilities: [
    {
      // capabilities for a cordova iOS test
      name: 'ballotMainTest-iOSiPhone6',
      build: buildNameForDisplay,
      device: 'iPhone 6',
      os_version: '11',
      app: browserStackConfig.BROWSERSTACK_IPA_URL,
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: true,
      isIOS: true,
      isMobileScreenSize: true,
    },
    {
      name: 'ballotMainTest-iOSiPhone8',
      build: buildNameForDisplay,
      device: 'iPhone 8',
      os_version: '11',
      app: browserStackConfig.BROWSERSTACK_IPA_URL,
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: true,
      isIOS: true,
      isMobileScreenSize: true,
    },
    {
      name: 'ballotMainTest-iOSiPhoneX',
      build: buildNameForDisplay,
      device: 'iPhone X',
      os_version: '11',
      app: browserStackConfig.BROWSERSTACK_IPA_URL,
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: true,
      isIOS: true,
      isMobileScreenSize: true,
    },
    {
      name: 'ballotMainTest-iOSiPadPro12.92018',
      build: buildNameForDisplay,
      device: 'iPad Pro 12.9 2018',
      os_version: '12',
      app: browserStackConfig.BROWSERSTACK_IPA_URL,
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: true,
      isIOS: true,
      isMobileScreenSize: true,
    },
  ],
  coloredLogs: true,
  baseUrl: '',
  waitforTimeout: 180000, // 3 minutes
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    // timeout: 180000, // 3 minutes
    timeout: 360000, // 6 minutes
  },
};
