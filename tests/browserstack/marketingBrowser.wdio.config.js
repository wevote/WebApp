const browserStackConfig = require('./browserstack.config');
const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './tests/browserstack/specs/marketingWelcomeTest.js',
  ],
  exclude: [],
  capabilities: [
    {
      // capabilities for a browser web app test
      name: 'marketingWelcomeTest-Browser',
      build: buildNameForDisplay,
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: '72.0',
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
    },

    {
      // Testing with an iPhone Safari browser
      name: 'marketingTest-iPhoneSafariBrowser',
      build: buildNameForDisplay,
      device: 'iPhone 6',
      os_version: '11',
      real_mobile: true,
      browserName: 'Safari',
      browser_version: '11',
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
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
    timeout: 180000, // 3 minutes
  },
};
