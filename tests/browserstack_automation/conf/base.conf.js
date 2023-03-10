const browserStackConfig = require('./browserstack.conf');

module.exports = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  injectGlobals: false,
  updateJob: false,
  specs: [
    '../specs/ReadyPage.js',
  ],
  exclude: [],
  logLevel: 'warn',
  coloredLogs: true,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  hostname: 'hub.browserstack.com',
  services: [['browserstack']],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
