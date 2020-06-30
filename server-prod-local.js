#!/usr/bin/env node
// Run the express server locally with a production bundle.js, built with 'npm run prod'

// eslint-disable-next-line import/no-unresolved
const server = require('./server.js');

console.log('INFO: run \'npm run prod\' FIRST to build the production bundle');
console.log('INFO: this express server instance will not redirect from http to https, or vice versa.');
console.log('INFO: Not using webpack.');
console.log('INFO: Configured by the settings in settings in /src/js/config.js');
server();
