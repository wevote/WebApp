/* jshint esversion: 6 */
/* jslint node: true */

const fs = require('fs');
const readline = require('readline');

const originalFile = '/etc/hosts';
const saveOffFile = `${originalFile}.previous`;
let lines = 0;
console.log(`Processing ${originalFile}`);
fs.rename(originalFile, saveOffFile, () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(saveOffFile),
    crlfDelay: Infinity,
  });
  const newHosts = [];
  rl.on('line', (line) => {
    if (line.startsWith('127.0.0.1')) {
      if (line.includes('localhost') && !line.includes('wevotedeveloper')) {
        // eslint-disable-next-line no-param-reassign
        line = '127.0.0.1       localhost wevotedeveloper.com';
        console.log('adding::: wevotedeveloper.com ::: to /etc/hosts');
        lines++;
      }
      newHosts.push(line);
    } else {
      newHosts.push(line);
    }
  });
  rl.on('close', () => {
    const etcHosts = fs.openSync(originalFile, 'w');

    newHosts.forEach((txt) => {
      fs.writeSync(etcHosts, `${txt}\n`);
    });
    console.log(`etc hosts updated ${lines} lines in ${originalFile}`);
  });
});
