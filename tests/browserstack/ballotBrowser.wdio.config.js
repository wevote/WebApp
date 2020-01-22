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
      // Testing with an OnePlus browser
      name: 'ballotMainTest-AndroidOnePlus6TBrowser',
      build: buildNameForDisplay,
      device: 'OnePlus 6T',
      os_version: '9.0',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: true,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: true,
    },
    {
      // Testing with a Samsung Galaxy S8
      name: 'ballotMainTest-AndroidSamsungGalaxyS8Browser',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy S8',
      os_version: '7.0',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: true,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: true,
    },
    {
      //  Testing with an iPhone 6 Safari browser
      name: 'ballotMainTest-iPhone6SafariBrowser',
      build: buildNameForDisplay,
      device: 'iPhone 6',
      os_version: '11',
      real_mobile: true,
      browserName: 'Safari',
      browser_version: '11',
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: true,
      isMobileScreenSize: true,
    },
    {
      //  Testing with an iPhone 11 browser
      name: 'ballotMainTest-iPhone11Browser',
      build: buildNameForDisplay,
      device: 'iPhone 11',
      os_version: '13',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: true,
      isMobileScreenSize: true,
    },
    {
      // Testing with an iPadPro12 browser
      name: 'ballotMainTest-iPadPro12-9Browser',
      build: buildNameForDisplay,
      device: 'iPad Pro 12.9 2018',
      os_version: '13',
      real_mobile: true,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: true,
      isMobileScreenSize: false,
    },
    {
      // Testing with a Windows Desktop Firefox browser
      name: 'ballotMainTest-WindowsDesktopFirefoxBrowser',
      build: buildNameForDisplay,
      os: 'Windows',
      os_version: '10',
      browser: 'Firefox',
      browser_version: '72.0',
      // browser_version: '76.0.3809.100',
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
      // automationName: 'Appium',
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
