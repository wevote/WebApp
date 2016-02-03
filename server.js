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
