const fs = require('fs-extra');
const { exec } = require('child_process');

// DEBUG:   WebApp % node --inspect-brk ./node/buildSrcCordova.js

function addUShowStylesImport (fileTxt, path) {
  // Don't add import to exporting file
  if (path.includes('cordovaFriendlyUShowStyles')) return fileTxt;
  // is uShowMobile in file, as either an introduced call, or pre-existing call
  const hasMobile = fileTxt.match(/uShowMobile/) != null;
  const hasDeskTop = fileTxt.match(/uShowDesktopTablet/) != null;
  const hasMobileImport = fileTxt.match(/import.*?uShowMobile/) != null;
  const hasDeskTopImport = fileTxt.match(/import.*?uShowDesktopTablet/) != null;

  // if import needs is already met, return unchanged
  if (!hasMobile && !hasMobileImport && !hasDeskTop && !hasDeskTopImport) return fileTxt;
  if (hasMobile && hasMobileImport && hasDeskTop && hasDeskTopImport) return fileTxt;
  if (hasMobile && hasMobileImport && !hasDeskTop) return fileTxt;
  if (!hasMobile && hasDeskTop && hasDeskTopImport) return fileTxt;


  // build importPath
  const dirs = path.split('/');
  let importPath = '';
  // . srcCordova js         SuperSharingSendEmail.jsx (throw away)
  for (let i = 0; i < dirs.length - 4; i++) {
    importPath += '../';
  }

  let imp = 'import { ';
  if (hasMobile) imp += 'uShowMobile';
  if (hasMobile && hasDeskTop) imp += ', ';
  if (hasDeskTop) imp += 'uShowDesktopTablet';
  imp += ` } from '${importPath}components/Style/cordovaFriendlyUShowStyles';\n`;

  let ret = '';
  if (hasMobileImport || hasDeskTopImport) {
    // import { uShowMobile } from '../Style/cordovaFriendlyUShowStyles';
    // const m = fileTxt.match(/import {.*?cordovaFriendlyUShowStyles';\n/);
    ret = fileTxt.replace(/import {.*?cordovaFriendlyUShowStyles';\n/, imp);
  } else {
    const firstImp = fileTxt.match(/(import.*?;)/);
    const ind = firstImp.index;
    ret = fileTxt.substring(0, ind) + imp + fileTxt.substring(ind);
  }
  return ret;
}

function getVersionsFromConfigXML () {
  const path = '../WeVoteCordova/config.xml';
  const versions = {
    version: 'error',
    iosBundleVersion: 'error',
    androidBundleVersion: 'error',
  };
  const data = fs.readFileSync(path, 'utf-8');
  let regex = /version="(.*?)"/;
  let found = data.match(regex);
  if (found.length > 0) {
    console.log('version from config.xml: ', found[1]);
    versions.version = found[1];
  } else {
    console.log('version from config.xml: error');
  }
  regex = /ios-CFBundleVersion="(.*?)"/;
  found = data.match(regex);
  if (found.length > 0) {
    console.log('ios-CFBundleVersion from config.xml: ', found[1]);
    versions.iosBundleVersion = found[1];
  } else {
    console.log('ios-CFBundleVersion from config.xml: error');
  }
  regex = /android-versionCode="(.*?)"/;
  found = data.match(regex);
  if (found.length > 0) {
    console.log('android-versionCode from config.xml: ', found[1]);
    versions.androidBundleVersion = found[1];
  } else {
    console.log('android-versionCode from config.xml: error');
  }
  return versions;
}

function fileRewriterForCordova (path, versions) {
  // console.log('Do  ', path);
  if (path.endsWith('.css') || path.endsWith('cordovaOffsets.js')) {
    return;
  }
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) throw err;

    // Remove stripe
    let newValue = data.replace(/const stripePromise.*?$/gim, '// loadStripe removed for Cordova');
    // Remove all lazy loading
    newValue = newValue.replace(/(?:const )(.*?)\s(?:.*?\*\/)(.*?)\)\);$/gim,
      'import $1 from $2;  // rewritten from lazy');
    // Crash  out on multi-line Suspense
    const regex = /.*?<Suspense fallback={\(\n/;
    // console.log(path, newValue.match(regex));
    if (newValue.match(regex) != null) {
      const e = `FATAL ERROR multiline suspense fallback in ${path}`;
      throw new Error(e);
    }
    // Remove all Suspense imports
    newValue = newValue.replace(/import React, { Suspense } from 'react';/gim,
      'import React from \'react\';');
    newValue = newValue.replace(/import React, {\s*(.*?), Suspense } from 'react';/gim,
      'import React, { $1 } from \'react\';');
    // Remove one line Suspense mark up
    newValue = newValue.replace(/(<Suspense fallback={<><\/>}>)(.*?)(<\/Suspense>)/gim,
      '$2');
    // Remove all Suspense mark up
    newValue = newValue.replace(/^(\s*)(<\Suspense.*?)(\n)/gim,
      '$1<>$3  $1{/* $2   // Rewritten from Suspense */}$3');
    newValue = newValue.replace(/^(\s*)(<\/Suspense>)(\n)/gim,
      '$1  {/* </Suspense>  // Rewritten from Suspense */}$3$1</>$3');
    // Replace "initializeMoment" everywhere
    newValue = newValue.replace(/initializeMoment/gim, 'initializeMomentCordova');
    // Inject cordova startup in index.jsx, replace "importStartCordovaToken" etc
    newValue = newValue.replace(/^.*?importStartCordovaToken.*?$/gim,
      'import { initializationForCordova } from \'./js/startCordova\';');
    newValue = newValue.replace(/^.*?importRemoveCordovaListenersToken1.*?$/gim,
      'import { removeCordovaSpecificListeners } from \'./js/startCordova\';');
    newValue = newValue.replace(/^.*?importRemoveCordovaListenersToken2.*?$/gim,
      'import { removeCordovaSpecificListeners } from \'../../startCordova\';');
    newValue = newValue.replace(/^.*?initializeCordovaToken.*?$/gim,
      '  initializationForCordova(() => startReact());');
    newValue = newValue.replace(/^.*?removeCordovaListenersToken.*?$/gim,
      '    removeCordovaSpecificListeners();');
    // Switch over to HashRouter for Cordova
    newValue = newValue.replace(/BrowserRouter/g, 'HashRouter');
    // Handle u-show-mobile and u-show-desktop-tablet not working well with HTML media queries for device width in Cordova
    if (newValue.match(/u-show-desktop-tablet.(?!.*?>)/gim) != null) {
      if (newValue.match(/suppressCordova u-show-desktop-tablet.(?!.*?>)/gim) != null) {
        throw new Error(`FATAL ERROR multiline u-show-desktop-tablet in ${path}`);
      }
    }
    newValue = newValue.replace(/className="u-show-mobile"/gim, 'style={uShowMobile()}');
    newValue = newValue.replace(/(?!\/\/>)className="u-show-desktop-tablet"/gim, 'style={uShowDesktopTablet()}');
    newValue = newValue.replace(/(.*?)u-show-mobile(.*?)>/, '$1$2 style={uShowMobile()}>\n');
    newValue = newValue.replace(/(.*?)u-show-desktop-tablet(.*?)>/, '$1$2 style={uShowDesktopTablet()}>\n');
    // Remove Donate from Cordova -- Stripe causes problems and is not allowed in the app store
    if (path.includes('App.js')) {
      newValue = newValue.replace(/^.*?Donate.*?\n/gim, '');
      newValue = newValue.replace(/^(\s*).*?\/pay-to-promote.*?\n/gim, '$1{/* Removed /pay-to-promote for Cordova */}\n');
      newValue = newValue.replace(/^import CampaignSupportPayToPromote.*?\n/gim, '// Removed Import CampaignSupportPayToPromote*\n');
    }
    // Set is Cordova true in index.jsx
    if (path.endsWith('index.jsx')) {
      newValue = newValue.replace(/isIndexCordova = false;/g, 'isIndexCordova = true;');
    }

    // append an eslint suppression at the top of each file
    newValue = `/* eslint-disable no-unused-vars */\n/* eslint-disable import/newline-after-import */\n/* eslint-disable import/order */\n/* eslint-disable react/jsx-indent */\n${newValue}`;

    // append an import of cordovaFriendlyUShowStyles.js at top of each file where needed
    newValue = addUShowStylesImport(newValue, path);

    // Inject version string
    newValue = newValue.replace(/window\.weVoteAppVersion/, versions.version);
    newValue = newValue.replace(/window\.iosBundleVersion/, versions.iosBundleVersion);
    newValue = newValue.replace(/window\.androidBundleVersion/, versions.androidBundleVersion);

    fs.writeFile(path, newValue, 'utf-8', (err2) => {
      if (err2) throw err2;
      // console.log('Done! with ', path);
    });
  });
}

// Inline node

console.log('> Cordova: Preparing to set up parallel /srcCordova directory.');
const versions = getVersionsFromConfigXML();
fs.remove('./build').then(() => {
  console.log('> Cordova: Removed build directory');
  fs.remove('./srcCordova').then(() => {
    console.log('> Cordova: Removed /srcCordova directory, if it existed');
    try {
      fs.copy('./src', './srcCordova', () => {
        console.log('> Cordova: Copied the /src dir to a newly created /srcCordova directory');
        exec('egrep -rl "React.lazy|BrowserRouter|initializeMoment|Suspense|u-show-desktop-tablet|u-show-mobile|uShowMobile|uShowDesktopTablet|window.weVoteAppVersion" ./srcCordova', (error, stdout, stderr) => {
          if (error) {
            console.log(`> Cordova bldSrcCordova error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`> Cordova bldSrcCordova stderr: ${stderr}`);
            return;
          }
          const listOfFiles = stdout.split('\n');
          listOfFiles.push('./srcCordova/js/common/components/Widgets/WeVoteRouter.jsx');
          listOfFiles.push('./srcCordova/index.jsx');
          for (let i = 0; i < listOfFiles.length; i++) {
            const path = listOfFiles[i];
            // console.log(`path: ${path}`);
            if (path.length) {
              fileRewriterForCordova(path, versions);
            }
          }
          console.log(`> Cordova: ${listOfFiles.length} files in ./srcCordova, rewritten without React.lazy`);
          exec('egrep -r "React.lazy|Suspense" ./srcCordova | grep -v "//" | grep -v "" | grep -v "(factory)"',
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
