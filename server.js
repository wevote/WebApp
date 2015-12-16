var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var port = process.argv[2] || 3001;
var host = 'localhost';
var webpack_dev_options = {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    color: true,
    progress: true
};

new WebpackDevServer (
    webpack(config),
    webpack_dev_options
)
.listen(port, host, (err /*,result*/) => {
    if (err) console.log(err);
    console.log('Listening at http://' + host + ':' + port);
});
