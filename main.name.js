const fs = require('fs');
const glob = require('glob');

// builds a tiny html file, that contains the name of the main.hash.js chunk
// Consumed by the WeVoteServer which is queried by Fastly for customized domains
glob('./build/main.*.js', (err, files) => {
  if (files.length) {
    const pieces = files[0].split('/');
    const html = `<!DOCTYPE html><html><body>/${pieces[2]}</body></html>`;
    fs.writeFile('./build/main.name.html', html, () => {
    });
  }
});
