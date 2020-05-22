const browserStackConfig = require('./browserstack.config');

const date = new Date();
const dateForDisplay = date.toDateString();
const buildNameForDisplay = `${browserStackConfig.BUILD}: ${dateForDisplay}`;

exports.config = {
  user: browserStackConfig.BROWSERSTACK_USER,
  key: browserStackConfig.BROWSERSTACK_KEY,
  specs: [
    './tests/browserstack/specs/%scriptNameMainTest.js',
  ]

  capabilities: [{
      name: '%name',
      'build': buildNameForDisplay,
      'project': '%project',
      'device': '%device',
      'os_version': '%os_version',
      browser: '%browser',
      'acceptSslCerts': '%ssl',
      'browserstack.local': %local,
      'browserstack.console': %console,
      'browserstack.debug': %debug
    }]
}
