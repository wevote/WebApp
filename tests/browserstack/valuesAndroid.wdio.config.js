const browserStackConfig = require('./browserstack.config');

const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  updateJob: false,
  specs: [
    './tests/browserstack/specs/valuesMainTest.js',
  ],
  exclude: [],
  twitterUserName: browserStackConfig.TWITTER_USER_NAME,
  twitterPassword: browserStackConfig.TWITTER_PASSWORD,
  capabilities: [
    {
      // capabilities for a cordova android test
      name: 'valuesMainTest-AndroidGalaxyTabS4',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy Tab S4',
      os_version: '8.1',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',           
      'browserstack.local': false,
      isAndroid: true,
      isCordovaFromAppStore: true,
      isIOS: false,
      isMobileScreenSize: false,
    },
    {
      // capabilities for a cordova android test
      name: 'valuesMainTest-AndroidSamsungGalaxyS8',
      build: buildNameForDisplay,
      device: 'Samsung Galaxy S8', 		    
      os_version: '7.0',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',           
      'browserstack.local': false,
      isAndroid: true,
      isCordovaFromAppStore: true,
      isIOS: false,
      isMobileScreenSize: true,
    },
    {
      name: 'valuesMainTest-AndroidOnePlus6T',
      build: buildNameForDisplay,
      device: 'OnePlus 6T',			    
      os_version: '9.0',
      app: browserStackConfig.BROWSERSTACK_APK_URL,
      'browserstack.console': 'info',
      'browserstack.debug': true,
      'browserstack.geoLocation': 'US',           
      'browserstack.local': false,
      isAndroid: true,
      isCordovaFromAppStore: true,
      isIOS: false,
      isMobileScreenSize: true,
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
