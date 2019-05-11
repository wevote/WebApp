const browserStackConfig = require('./browserstack.config');

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './tests/browserstack/specs/ballotMainTest.js',
  ],
  exclude: [],
  capabilities: [
    {
      // capabilities for a cordova iOS test
      name: 'ballotMainTest-iOS',
      build: browserStackConfig.BUILD,
      device: 'iPhone 8 Plus',
      os_version: '11',
      app: browserStackConfig.BROWSERSTACK_IPA_URL,
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
