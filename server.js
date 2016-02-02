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
    }
};

var server = new WebpackDevServer ( webpack(webpack_config),
    webpack_dev_options
);

server.listen(webpack_config.web_app_server_port, webpack_config.web_app_server_host, err => err ?
    console.error(err) :
    console.log('Listening at http://' + webpack_config.web_app_server_host + ':' + webpack_config.web_app_server_port)
);
