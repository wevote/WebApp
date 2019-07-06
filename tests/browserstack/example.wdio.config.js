const browserStackConfig = require('./browserstack.config');

const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './tests/browserstack/specs/exampleTest.js',
  ],
  exclude: [],
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
      isCordova: false,
      isMobile: false,
    },
    {
      // Testing with an iPhone Safari browser
      name: 'ballotMainTest-iPhoneSafariBrowser',
      build: buildNameForDisplay,
      device: 'iPhone 6',
      os_version: '11',
      real_mobile: true,
      browserName: 'Safari',
      browser_version: '11',
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isCordova: false,
      isMobile: true,
    },
    {
      // capabilities for a cordova android test
      name: 'ballotMainTest-AndroidGalaxyTabS4',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy Tab S4',
      os_version: '8.1',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isCordova: true,
      isMobile: true,
    },
    {
      // capabilities for a cordova iOS test
      name: 'ballotMainTest-iOSiPhone6',
      build: buildNameForDisplay,
      device: 'iPhone 6',
      os_version: '11',
      app: browserStackConfig.BROWSERSTACK_IPA_URL,
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
      isCordova: true,
      isMobile: true,
    },
  ],
  coloredLogs: true,
  logLevel: 'trace',
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
