// start the express server
// 
const express = require('express');
const app = express();

const port = 3003;
const opts = {
  redirect: true
};

app
  .use( '/', express.static('build', opts))
  .all( '*', (req, res) => res.sendFile(__dirname + '/build/index.html'))
  .listen(port, () =>
    console.log('INFO: '.bold + 'express server started', new Date()) ||
    console.log('INFO: '.bold + 'Server is at http://localhost:%d', port)
  );
