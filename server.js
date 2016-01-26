var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = 3001;
var host = 'localhost';

var webpack_dev_options = {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    progress: true,
    quiet: false,
    noInfo: false,
    stats: {
        colors: true
    }
};

var server = new WebpackDevServer ( webpack(config),
    webpack_dev_options
);

server.listen(port, host, err => err ?
    console.error(err) :
    console.log('Listening at http://' + host + ':' + port)
);
