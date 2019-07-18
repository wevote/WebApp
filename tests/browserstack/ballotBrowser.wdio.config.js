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
  capabilities: [
    {
      // Testing with a Windows Desktop Chrome browser
      name: 'ballotMainTest-WindowsDesktopChromeBrowser',
      build: buildNameForDisplay,
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: '72.0',
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isAndroid: false,
      isCordovaFromAppStore: false,
      isIOS: false,
      isMobileScreenSize: false,
    },
    // {
    //   // Testing with an iPhone Safari browser
    //   name: 'ballotMainTest-iPhoneSafariBrowser',
    //   build: buildNameForDisplay,
    //   device: 'iPhone 6',
    //   os_version: '11',
    //   real_mobile: true,
    //   browserName: 'Safari',
    //   browser_version: '11',
    //   'browserstack.console': 'info',
    //   'browserstack.debug': true,
    //   'browserstack.geoLocation': 'US',
    //   isAndroid: false,
    //   isCordovaFromAppStore: false,
    //   isIOS: true,
    //   isMobileScreenSize: true,
    // },
    // {
    //   // Testing with an OnePlus Chrome browser
    //   name: 'ballotMainTest-OnePlus6TChromeBrowser',
    //   build: buildNameForDisplay,
    //   device: 'OnePlus 6T',
    //   os_version: '9.0',
    //   real_mobile: true,
    //   browserName: 'Chrome',
    //   browser_version: '72.0',
    //   'browserstack.console': 'info',
    //   'browserstack.debug': true,
    //   'browserstack.geoLocation': 'US',
    //   isAndroid: true,
    //   isCordovaFromAppStore: false,
    //   isIOS: false,
    //   isMobileScreenSize: true,
    // },
    // {
    //   // Testing with an iPhone Safari browser
    //   name: 'ballotMainTest-iPadSafariBrowser',
    //   build: buildNameForDisplay,
    //   device: 'iPad Pro 12.9 2018',
    //   os_version: '12',
    //   real_mobile: true,
    //   browserName: 'Safari',
    //   browser_version: '11',
    //   'browserstack.console': 'info',
    //   'browserstack.debug': true,
    //   'browserstack.geoLocation': 'US',
    //   isAndroid: false,
    //   isCordovaFromAppStore: false,
    //   isIOS: true,
    //   isMobileScreenSize: false,
    // },
    // {
    //   // Testing with an iPhone Safari browser
    //   name: 'ballotMainTest-iPadSafariBrowser',
    //   build: buildNameForDisplay,
    //   device: 'iPad Pro 12.9 2018',
    //   os_version: '12',
    //   real_mobile: true,
    //   browserName: 'Safari',
    //   browser_version: '11',
    //   'browserstack.console': 'info',
    //   'browserstack.debug': true,
    //   'browserstack.geoLocation': 'US',
    //   isAndroid: false,
    //   isCordovaFromAppStore: false,
    //   isIOS: true,
    //   isMobileScreenSize: true,
    // },
  ],
  coloredLogs: true,
  baseUrl: '',
  waitforTimeout: 180000, // 3 minutes
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000, // 3 minutes
  },
};
