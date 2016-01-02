const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const sassLoaders = [
    'css-loader',
    'postcss-loader',
    'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './src')
]

const config = {
    devtool: 'eval',
    resolve: {
        root: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'build'),
            path.resolve(__dirname, 'node_modules')
        ],
        extensions: ['','.js','.jsx','.sass'],
        moduleDirectories: ['src', 'node_modules']
    },
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:3001',
        'babel-polyfill',
        path.join(__dirname, 'src/index')
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/node_modules/]),
        new ExtractTextPlugin('[name].css')
    ],
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                include: path.join(__dirname, 'src'),
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {test: /\.css$/, loader:'style-loader!css-loader'},
            {test: /\.json/, loader: 'json-loader'},
            {test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$/, loader: 'url-loader' },
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader' },
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader' },
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader' },
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader' },
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader' },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
            }
            // {test: /\.md$/, loader: 'html!markdown' },
        ]
    }
}

module.exports = config
