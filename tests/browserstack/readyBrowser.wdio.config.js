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
    './tests/browserstack/specs/readyMainTest.js',
  ],
  twitterUserName: browserStackConfig.TWITTER_USER_NAME,
  twitterPassword: browserStackConfig.TWITTER_PASSWORD,
  exclude: [],
  capabilities: [
    {
        name: 'readyMainTest-BrowserWindowsChrome80.0',
        build: buildNameForDisplay,
        os: 'Windows',
        os_version: '10',
        browserName: 'Chrome',
        browser_version: '80.0',
        real_mobile: false,
        acceptSslCerts: true,
        'browserstack.console': 'info',
        'browserstack.debug': true,
        'browserstack.local': false,
        'browserstack.geoLocation': 'US',
        isAndroid: false,
        isCordovaFromAppStore: false,
        isIOS: false,
        isMobileScreenSize: false,
    },
  ],
  waitforTimeout: 180000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 360000,
  },
}
