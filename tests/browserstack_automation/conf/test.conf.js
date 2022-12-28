const browserStackConfig = require('./browserstack.conf');
const baseConfig = require('./base.conf');
const capabilities = require('./capabilities.json');

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

const parallelConfig = {
  capabilities,
  commonCapabilities: {
    'bstack:options': {
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
