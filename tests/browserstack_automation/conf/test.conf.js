const browserStackConfig = require('./browserstack.conf');
const baseConfig = require('./base.conf');

const date = new Date();

const dateForDisplay = date.toDateString();

const buildName = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

const parallelConfig = {
  capabilities: [
    {
      browserName: 'Chrome',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'Windows',
        osVersion: '10',
      },
    },
    {
      browserName: 'Safari',
      browserVersion: '13.1',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Catalina',
      },
    },
  ],
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
  const keys = Object.keys(capability);
  keys.forEach((key) => {
    if (key in module.exports.config.commonCapabilities) {
      const device = capability;
      device[key] = {
        ...device[key],
        ...module.exports.config.commonCapabilities[key],
      };
    }
  });
});
