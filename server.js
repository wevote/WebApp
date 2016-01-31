const fs = require('fs');
const colors = require('colors');

const assets = (()=>{
  const _p = require('path');
  const output = [__dirname + '/build'];
  const input = [__dirname + '/src'];

  return {
    in: function () {
      return _p.resolve.apply(_p, input.concat([].slice.call(arguments)));
    },
    out: function () {
      return _p.resolve.apply(_p, output.concat([].slice.call(arguments)));
    }
  };

})();

// start the express server
const express = require('express');
const app = express();

const port = 8080;
 var options = {
  redirect: true
};

app
  .use( express.static(assets.out(), options))
  .listen(port, () =>
    console.log('INFO: '.bold + 'express server started', new Date()) ||
    console.log('INFO: '.bold + 'Server is at http://localhost:%d', port)
  );

fs // create HTML file for webapp
  .createWriteStream( assets.out('index.html') )
  .write(`<!DOCTYPE html>
<html lang="en">
  <head>
      <title> WeVoteUSA </title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <link href="/css/bootstrap.css" rel="stylesheet">
      <link href="/css/font-awesome.css" rel="stylesheet">
  </head>
  <body>
      <div id="app"></div>
      <script src="/js/bundle.js"></script>
  </body>
</html>`, 'utf8');

const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const sassify = require('sassify');

const reactInFile = assets.in('js', 'index.js');
const reactOutFile = assets.out('js','bundle.js');
const react = browserify({
  debug: true,
  entries: reactInFile,
  basedir: assets.in(),
  extensions: ['.js','.jsx', '.scss'],
  plugin: [watchify],
  ignoreWatch: ['**/node_modules/**'],
  pasckageCache: {},
  cache: {}
});

react.on( 'error', error );
react.on( 'update', bundleReact );
// react.on( 'bundle', (a,b,c) => console.log(a,b,c));
react.on( 'transform', (tr,file) => tr.on('error', error));
react.on( 'log', (msg) =>
  console.log('INFO:'.bold +' [BUILD-REACT] @' + new Date().toString()) ||
  console.log('DONE:'.bold.green, msg, '=>', reactOutFile)
);

bundleReact();

function bundleReact (ids) {
  if (ids) console.log('CHANGE: '.bold.blue + ids.join(', ') );
  if (ids) console.log('\t...REBUILDING...'.bold.blue);

  react
    .transform( sassify, { 'auto-inject': true, base64Encode: true, sourceMap: false })
    .transform( babelify )
    .bundle()
    .pipe (
      fs.createWriteStream (
        reactOutFile
      )
    );
}
const error = (er) => console.log('ERROR:'.bold.red, er.message);

function getStats (res) {
  return  Buffer.byteLength(res.css) +
    ' bytes written (' +
    dateDiff(res.stats.end, res.stats.start) + ' seconds) => ' +
    assets.out('css','main.css');
}

function dateDiff (start, finish) {
  return Math.abs( (start-finish) / 1000 );
}
