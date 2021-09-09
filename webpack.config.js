/* jshint esversion: 6 */
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const port = process.env.PORT || 3000;
const isHTTPS = process.env.PROTOCOL && process.env.PROTOCOL === 'HTTPS';
const isWebApp = !process.env.npm_lifecycle_script.includes('CORDOVA=1');
const source = isWebApp ? 'src' : 'srcCordova';
const bundleAnalysis = process.env.ANALYSIS || false;  // enable the interactive bundle analyser and the Unused component analyzer
const minimized = process.env.MINIMIZED || false;  // enable the Terser plugin that strips comments and shrinks long variable names
// console.log('>>>> process.env: ', process.env);
// console.log('>>>> bundleAnalysis: ', bundleAnalysis);

module.exports = (env, argv) => ({
  entry: path.resolve(__dirname, `./${source}/index.jsx`),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|srcDeprecated/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jp(e*)g|svg|eot|woff|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/',
              exclude: /srcDeprecated/,
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      ...(minimized ? [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            format: {
              comments: false,
            },
          },
        }),
      ] : []),
      new CssMinimizerPlugin({
        test: /\.css$/i,
      }),
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, source), 'node_modules'],
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: isWebApp ? '[name].[contenthash].js' : 'bundle.js',
    publicPath: isWebApp ? '/' : undefined,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({ failOnError: false, failOnWarning: false  }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'We Vote Web App',
      template: path.resolve(__dirname, `./${source}/index.html`),
    }),
    ...(bundleAnalysis ? [
      new UnusedWebpackPlugin({  // Set ANALYSIS to true to list (likely) unused files
        directories: [path.join(__dirname, source)],
        exclude: [
          '/**/cert/',
          '/**/global/svg-icons/',
          '/*.test.js',
          '/**/config*.*',
          '/sass/',
          '/robots.txt',
          'srcDeprecated',
        ],
        root: __dirname,
      }),
      new BundleAnalyzerPlugin(),
    ] : []),
    new CopyPlugin({
      patterns: [
        { from: `${source}/robots.txt`,  to: '.' },
        { from: `${source}/css/`,        to: 'css/' },
        {
          from: `${source}/img`,
          to: 'img/',
          globOptions: { ignore: ['DO-NOT-BUNDLE/**/*'] },
        },
        { from: `${source}/javascript/`, to: 'javascript/' },
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
      key: fs.readFileSync(`./${source}/cert/server.key`),
      cert: fs.readFileSync(`./${source}/cert/server.crt`),
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
