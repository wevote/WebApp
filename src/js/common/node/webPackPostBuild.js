const fs = require('fs');
const glob = require('glob');

// builds a tiny html file, that contains the name of the main.hash.js chunk which is
// consumed by the WeVote API Server.  When the Server is queried by Fastly to generate an index.html
// for customized domains (and for the WebApp including the wevote.us intance), the API server loads
// the main.name.html which contains the name of the main.[hash].js file.
glob('./build/main.*.js', (err, files) => {
  if (files.length) {
    const file0 = files[0];
    // create the main.name.html file
    const pieces = file0.split('/');
    const html = `<!DOCTYPE html><html><body>/${pieces[2]}</body></html>`;
    fs.writeFile('./build/main.name.html', html, () => console.log('webPackPostBuild:  ./build/main.name.html has been created'));

    // Feb 2022, Sidelined approach for renaming the main.[hash].js file to remove the hash
    // Next rename a file like main.a57f965b6918cee83aae.js to main.js, so it can be called without
    // configuration by the fastly call to organizationIndex on the API server
    // const destName = './build/main.js';
    // fs.renameSync(file0, destName);
    // console.log(`WebPackPostBuild:  ${file0} has been renamed to ${destName}`);
    // next rename the <script defer="defer" src="/main.9871eda3cd9fbb2d224e.js"> in the generated index.html file
    // eslint-disable-next-line consistent-return
    //     const indexFile = './build/index.html';
    //     fs.readFile(indexFile, 'utf8', (err2, data) => {
    //       if (err2) return console.log('read error: ', err);
    //       const result = data.replace(/(.*?<script defer="defer" src="\/main)(\..*?)(\.js">.*?)/g, '$1$3');
    //       fs.writeFile(indexFile, result, 'utf8', (err3) => {
    //         if (err3) return console.log(err3);
    //         return true;
    //       });
    //     });
  }
});

