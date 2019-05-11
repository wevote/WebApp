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
      // capabilities for a browser web app test
      name: 'marketingWelcomeTest-Browser',
      build: browserStackConfig.BUILD,
      os: 'Windows',
      os_version: '7',
      browserName: 'Chrome',
      browser_version: '72.0',
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
