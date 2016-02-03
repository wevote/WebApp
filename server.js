<<<<<<< HEAD
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
=======
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpack_config = require('./webpack.config');

var webpack_dev_options = {
    publicPath: webpack_config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    progress: true,
    quiet: false,
    noInfo: false,
    stats: {
        colors: true
>>>>>>> origin/develop
    }
  };

})();

<<<<<<< HEAD
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
=======
var server = new WebpackDevServer ( webpack(webpack_config),
    webpack_dev_options
);

server.listen(webpack_config.web_app_server_port, webpack_config.web_app_server_host, err => err ?
    console.error(err) :
    console.log('Listening at http://' + webpack_config.web_app_server_host + ':' + webpack_config.web_app_server_port)
);
>>>>>>> origin/develop
