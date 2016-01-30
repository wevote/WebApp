const browserify = require('browserify');

browserify()
  .transform(require('babelify'));


const express = require('express');
const app = express();

const webroot = '/build';
const port = 8080;

app
  .use( express.static(__dirname + webroot) )
  .listen(port, () =>
    console.log('express server running at http://localhost:%d', port)
  );
