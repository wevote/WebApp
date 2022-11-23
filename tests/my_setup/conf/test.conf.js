const parallelConfig = {
  user: 'josephevans_Tl1dVS',
  key: 'MBfCTeKv7hYraEHusDcA',
  hostname: 'hub.browserstack.com',
  capabilities: [
    {
      browserName: 'Chrome',
      browserVersion: '103.0',
      'bstack:options': {
        os: 'Windows',
        osVersion: '11'
      }
    },
    {
      browserName: 'Firefox',
      browserVersion: '102.0',
      'bstack:options': {
        os: 'Windows',
        osVersion: '10'
      }
    },
    {
      browserName: 'Safari',
      browserVersion: '14.1',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Big Sur'
      }
    }
  ],
  commonCapabilities: {
    'bstack:options': {
      buildName: 'browserstack-build-1'
    }
  },
  maxInstances: 10
};
const { config: baseConfig } = require('./base.conf.js');
exports.config = { ...baseConfig, ...parallelConfig };
// Code to support common capabilities
exports.config.capabilities.forEach(function(caps) {
  for (var i in exports.config.commonCapabilities)
    caps[i] = { ...caps[i], ...exports.config.commonCapabilities[i] };
});
