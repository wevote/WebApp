const { config } = require('./wdio.config.js'); 

config.capabilities = [{
  maxInstances: 5,
  browserName: 'chrome',
  acceptInsecureCerts: true,
  'goog:chromeOptions': {
    args: ['--start-maximized']
  }
}];

delete config.user;
delete config.key;
config.services = [];

module.exports = { config };

