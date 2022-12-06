const chai = require('chai');
const browserStackConfig = require('./browserstack.conf');

module.exports = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,

  updateJob: false,

  // specs is a list of paths to your test file(s)
  specs: [
    './tests/browserstack_automation/specs/wdioSampleTest.js',
  ],
  exclude: [],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  hostname: 'hub.browserstack.com',
  services: [['browserstack']],

  before () {
    global.assert = chai.assert;
    global.expect = chai.expect;
    chai.Should();
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
