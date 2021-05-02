/* jshint esversion: 6 */
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const port = process.env.PORT || 3000;
const isHTTPS = process.env.PROTOCOL && process.env.PROTOCOL === 'HTTPS';
const bundleAnalysis = process.env.ANALYSIS || false;  // enable the interactive bundle analyser and the Unused component analyzer

module.exports = (env, argv) => ({
  entry: path.resolve(__dirname, './src/index.jsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jp(e*)g|svg|eot|woff|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/',
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({ failOnError: false, failOnWarning: false  }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'We Vote Web App',
      template: path.resolve(__dirname, './src/index.html'),
    }),
    ...(bundleAnalysis ? [
      new UnusedWebpackPlugin({  // Set ANALYSIS to true to list (likely) unused files
        directories: [path.join(__dirname, 'src')],
        exclude: [
          '/**/cert/',
          '/**/global/svg-icons/',
          '/*.test.js',
          '/**/config*.*',
          '/sass/',
          '/robots.txt',
        ],
        root: __dirname,
      }),
      new BundleAnalyzerPlugin(),
    ] : []),
    new CopyPlugin({
      patterns: [
        { from: 'src/robots.txt', to: '.' },
        { from: 'src/css/', to: 'css/' },
        {
          from: 'src/img',
          to: 'img/',
          globOptions: { ignore: ['DO-NOT-BUNDLE/**/*']},
        },
        {
          from: 'src/javascript/',
          to: 'javascript/',
        },
      ],
    }),
    new MomentLocalesPlugin(),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['node main.name.js'],
        blocking: false,
        parallel: true,
      },
    }),
    ...(argv.mode === 'production' ? [
      new webpack.DefinePlugin({
        // We need to get webpack into production mode, to make it include the much smaller minimized libraries
        // especially for React itself.
        // PRODUCTION: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ] : []),
  ],
  devServer: (isHTTPS ? {
    contentBase: path.resolve(__dirname, './build'),
    https: {
      key: fs.readFileSync('./src/cert/server.key'),
      cert: fs.readFileSync('./src/cert/server.crt'),
    },
    host: 'localhost',
    port,
    public: `localhost:${port}`,
    historyApiFallback: true,
    open: true,
    disableHostCheck: true,
  } : {
    contentBase: path.resolve(__dirname, './build'),
    host: 'localhost',
    port,
    public: `localhost:${port}`,
    historyApiFallback: true,
    open: true,
  }),
  devtool: 'source-map',
});
