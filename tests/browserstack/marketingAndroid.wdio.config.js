const browserStackConfig = require('./browserstack.config');

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
      // capabilities for a cordova android test
      name: 'marketingWelcomeTest-Android',
      build: browserStackConfig.BUILD,
      device: 'Samsung Galaxy Tab S4',
      os_version: '8.1',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',
    },
  ],
  coloredLogs: true,
  baseUrl: '',
  waitforTimeout: 50000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 50000,
  },
};
