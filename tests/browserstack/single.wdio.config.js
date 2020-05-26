const browserStackConfig = require('./browserstack.config');

const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  webAppRootUrl: browserStackConfig.WEB_APP_ROOT_URL,
  updateJob: false,
  specs: [
    './tests/browserstack/specs/%scriptNameMainTest.js',
  ],
  twitterUserName: browserStackConfig.TWITTER_USER_NAME,
  twitterPassword: browserStackConfig.TWITTER_PASSWORD,
  exclude: [],
  capabilities: [
    {
      name: '%name',
      build: buildNameForDisplay,
      device: '%device',
      os: '%os',
      os_version: '%os_version',
      browserName: '%browserName',
      browser_version: '%browser_version',
      real_mobile: %real_mobile,
      acceptSslCerts: %ssl,
      'browserstack.debug': %debug,
      'browserstack.local': %localTest,
      isAndroid: %isAndroid,
      isCordovaFromAppStore: %isCordova,
      isIOS: %isIOS,
      isMobileScreenSize: %isMobileScreenSize,
    },
  waitforTimeout: %waitForTimeout,
  connectionRetryTimeout: %connectionRetryTimeout,
  connectionRetryCount: %connectionRetryCount,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 18,
  },
}
