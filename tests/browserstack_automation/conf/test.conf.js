const { readFileSync } = require('fs');
const browserStackConfig = require('./browserstack.conf');
const baseConfig = require('./base.conf');
let capabilities = require('./defaultCapabilities.json');

try {
  const data = readFileSync('./tests/browserstack_automation/conf/capabilities.json', { encoding: 'utf8' });
  capabilities = JSON.parse(data);
} catch (error) {
  // Run buildCapabilities.js
}

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

const parallelConfig = {
  capabilities,
  commonCapabilities: {
    'bstack:options': {
      appiumVersion: '2.0.0',
      buildName,
    },
  },
  maxInstances: 10,
};

module.exports.config = {
  ...baseConfig,
  ...parallelConfig,
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
