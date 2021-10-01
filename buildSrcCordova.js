const fs = require('fs-extra');
const { exec } = require('child_process');

function fileRewriterForCordova (path) {
  // console.log('Do  ', path);
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) throw err;

    // console.log('data before  ', data);
    // Remove all lazy loading
    let newValue = data.replace(/(?:const )(.*?)\s(?:.*?\*\/)(.*?)\)\);$/gim,
      'import $1 from $2;  // rewritten from lazy');
    // Remove all Suspense imports
    newValue = newValue.replace(/import .*?, Suspense }.*?$/gim,
      'import React, { Component } from \'react\';');
    // Remove all Suspense mark up
    newValue = newValue.replace(/^(\s*)(<\/?Suspense.*?)$/gim,
      '$1{/* $2   // Rewritten from Suspense */}');
    // Replace "initializeMoment" everywhere
    newValue = newValue.replace(/initializeMoment/gim, 'initializeMomentCordova');
    // Inject cordova startup in App.jsx, replace "importStartCordovaToken" etc
    newValue = newValue.replace(/^.*?importStartCordovaToken.*?$/gim,
      'import { initializationForCordova, removeCordovaSpecificListeners } from \'./js/startCordova\';');
    newValue = newValue.replace(/^.*?initializeCordovaToken.*?$/gim,
      '    initializationForCordova(() => this.setState({cordovaInitialized: true}));');
    newValue = newValue.replace(/^.*?removeCordovaListenersToken.*?$/gim,
      '    removeCordovaSpecificListeners();');
    // Switch over to HashRouter for Cordova
    newValue = newValue.replace(/BrowserRouter/g, 'HashRouter');
    // Remove Donate from Cordova -- Stripe causes problems and is not allowed in the app store
    if (path.includes('App.js')) {
      newValue = newValue.replace(/^.*?Donate.*?\n/gim, '');
    }
    // Set is Cordova true in index.jsx
    if (path.endsWith('index.jsx')) {
      newValue = newValue.replace(/isIndexCordova = false;/g, 'isIndexCordova = true;');
    }

    // append an eslint suppression at the top of each file
    newValue = `/* eslint-disable no-unused-vars */\n/* eslint-disable import/newline-after-import */\n/* eslint-disable import/order */\n/* eslint-disable react/jsx-indent */\n${newValue}`;
    /* eslint-disable react/jsx-props-no-spreading */
    fs.writeFile(path, newValue, 'utf-8', (err2) => {
      if (err2) throw err2;
      // console.log('Done! with ', path);
    });
  });
}

console.log('> Cordova: Preparing to set up parallel /srcCordova directory.');
fs.remove('./build').then(() => {
  console.log('> Cordova: Removed build directory');
  fs.remove('./srcCordova').then(() => {
    console.log('> Cordova: Removed /srcCordova directory, if it existed');
    try {
      fs.copy('./src', './srcCordova', () => {
        console.log('> Cordova: Copied the /src dir to a newly created /srcCordova directory');
        exec('egrep -rl "React.lazy|BrowserRouter|initializeMoment" ./srcCordova', (error, stdout, stderr) => {
          if (error) {
            console.log(`> Cordova bldSrcCordova error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`> Cordova bldSrcCordova stderr: ${stderr}`);
            return;
          }
          const listOfFiles = stdout.split('\n');
          listOfFiles.push('./srcCordova/js/components/Widgets/WeVoteRouter.jsx');
          listOfFiles.push('./srcCordova/index.jsx');
          for (let i = 0; i < listOfFiles.length; i++) {
            const path = listOfFiles[i];
            // console.log("path: " + path);
            if (path.length) {
              fileRewriterForCordova(path);
            }
          }
          console.log('> Cordova: Files rewritten without React.lazy: ', listOfFiles.length);
          exec('grep -r "React.lazy" ./srcCordova | grep -v "//" | grep -v "(factory)"',
            (error2, stdout2) => {
              const out = stdout2.split('\n');
              if (!(out.length === 1 && out[1] === undefined)) {
                console.log('> Cordova: Files that (incorrectly) still contain React.lazy: ');
                console.log(out);
                console.log('> Cordova: The files listed above, need to be fixed before proceeding!');  // Or the regex needs adjustment
              }
            });
        });
      });
    } catch (err) {
      console.log(err);
    }
  });
});



/*
Debugging command line node, See https://nodejs.org/en/docs/inspector

 1) In Chrome, chrome://inspect/#devices
 2) Click on "Open dedicated DevTools for Node"
 3) in the terminal:
      stevepodell@Steves-MacBook-Pro-32GB-Oct-2109 src % node --inspect-brk ./buildSrcCordova.js
 4) and it opens in the chrome debugger

 To lint the srcCordova dir
      stevepodell@Steves-MacBook-Pro-32GB-Oct-2109 WebApp % eslint --format stylish --ext .jsx --ext .js srcCordova/js
*/
