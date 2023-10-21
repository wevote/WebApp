// /Users/stevepodell/WebstormProjects/WebApp/node/buildSymLinksRemote.js
// /Users/stevepodell/WebstormProjects/WeVoteCordova/buildSymLinks.js

const process = require('process');
// eslint-disable-next-line camelcase
const child_process = require('child_process');

process.chdir('../WeVoteCordova');
console.log(`New directory: ${process.cwd()}`);
child_process.fork('buildSymLinks.js', ['/Users/stevepodell/WebstormProjects/WebApp/build']);
