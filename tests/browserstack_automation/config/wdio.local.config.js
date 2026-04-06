import { config } from './wdio.config.js';

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

export { config };

