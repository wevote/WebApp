const { browser, driver } = require('@wdio/globals');
const { readFileSync } = require('fs');
const browserStackConfig = require('./browserstack.config');
const browserCapabilities = require('../capabilities/browser_bvt.json');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

let mobileCapabilities = [];

try {
  const data = readFileSync('./tests/browserstack_automation/capabilities/mobile.json', { encoding: 'utf8' });
  mobileCapabilities = JSON.parse(data);
} catch (error) {

}

const capabilities = [...browserCapabilities, ...mobileCapabilities];

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.NAME}: ${dateForDisplay}`;

// https://webdriver.io/docs/configurationfile

module.exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  injectGlobals: false,
  updateJob: true,
  reporters: [
    [
      'spec',
      {
        onlyFailures: true,
      },
    ],
  ],
  specs: [
    '../specs/ProductDemo.js',



  ],
  capabilities,
  commonCapabilities: {
    'bstack:options': {
      buildName,
      debug: 'true',
      gpsLocation: '37.804363,-122.271111',
      maskCommands: 'setValues, getValues, setCookies, getCookies',
      video: 'true',
    },
  },
  maxInstances: 1,
  exclude: [],
  logLevel: 'error',
  coloredLogs: true,
  baseUrl: browserStackConfig.WEB_APP_ROOT_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: [['browserstack']],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  // https://webdriver.io/docs/customcommands#examples
  before: function before () {
    driver.addCommand('findAndClick', async function findAndClick () {
      await this.waitForExist();
      await this.moveTo();
      await this.click();
    }, true);
  },

 after: async function (result, capabilities, specs) {
  console.log('AFTER HOOK TRIGGERED');
  const sessionId = driver.sessionId;
  console.log('Running fetchAndUploadVideo for session:', sessionId);
  const scriptPath = require('path').resolve('./tests/browserstack_automation/specs/', 'downloadVideo.js');
  const cmd = `node ${scriptPath} ${sessionId}`;
  try {
      const { stdout, stderr } = await execAsync(cmd);
      if (stdout) console.log('Fetch & Upload Output (stdout):\n', stdout);
      if (stderr) console.warn('Fetch & Upload Output (stderr):\n', stderr);
    } catch (err) {
      console.error('Error during fetchAndUploadVideo:', err);
    }

//  exec(cmd)
//  .then(({ stdout, stderr }) => {
//    if (stdout) console.log('Fetch & Upload Output (stdout):\n', stdout);
//    if (stderr) console.warn('Fetch & Upload Output (stderr):\n', stderr);
//  })
//  .catch((err) => {
//    console.error('Error running fetch/upload script:', err.message);
//  });

 },


};

module.exports.config.capabilities.forEach((capability) => {
  const device = capability;
  const keys = Object.keys(device);
  keys.forEach((key) => {
    if (key in module.exports.config.commonCapabilities) {
      device[key] = {
        ...device[key],
        ...module.exports.config.commonCapabilities[key],
      };
    }
  });
});


