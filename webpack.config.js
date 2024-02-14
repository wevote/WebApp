/* jshint esversion: 6 */
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const RemovePlugin = require('remove-files-webpack-plugin');  removed due to outdated dependencies 1/3/2023
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
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
const useRealCerts = process.env.npm_lifecycle_script.includes('USE_REAL_CERTS=1');
const source = isWebApp ? 'src' : 'srcCordova';
const bundleAnalysis = process.env.ANALYSIS || false;  // enable the interactive bundle analyser and the Unused component analyzer
const minimized = process.env.MINIMIZED === '1' || process.env.MINIMIZED === 1 || false;  // enable the Terser plugin that strips comments and shrinks long variable names
const verBits = process.version.split('.');
const major = parseInt(verBits[0].replace('v', ''));
if (major < 13) {
  console.error(`The minimum Node version is: v14.0.0, but you are running ${process.version}\n`);
} else {
  console.log(`Node version is: ${process.version}`);
}

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
    minimize: minimized,
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
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, source), 'node_modules'],
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: isWebApp ? '[name].[contenthash].js' : 'bundle.js',
    publicPath: isWebApp ? '/' : undefined,
  },
  // source-map is for OpenReplay
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({ failOnError: false, failOnWarning: false  }),
    new HtmlWebpackPlugin({
      title: 'We Vote Sample Ballot',
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
          'extension.html',
          '/sass/',
          '/robots.txt',
          '/app-ads.txt',
          'srcDeprecated',
        ],
        root: __dirname,
      }),
      new BundleAnalyzerPlugin(),
    ] : []),
    new CopyPlugin({
      patterns: [
        { from: `${source}/robots.txt`,  to: '.' },
        { from: `${source}/app-ads.txt`,  to: '.' },
        {
          from: `${source}/css/`,
          to: 'css/',
          globOptions: { ignore: ['**/mainPreBeautified.css', '**/mainSubtract.css']},
        },
        { from: `${source}/extension.html`, to: '.' },
        {
          from: `${source}/img`,
          to: 'img/',
          globOptions: { ignore: ['**/DO-NOT-BUNDLE/**']},
        },
        { from: 'storybook-static', to: './storybook' },
      ],
    }),
    new MomentLocalesPlugin(),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['node ./src/js/common/node/webPackPostBuild.js'],
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
    ] : [
      new SourceMapDevToolPlugin({
        filename: isWebApp ? null : '[file].map', // if no value is provided the sourcemap is inlined
        exclude: [/node_modules/, /css/],
      }),
    ]),
  ],
  devServer: {
    allowedHosts: 'all',
    static: {
      directory: path.join(__dirname, './build'),
    },
    host: 'localhost',
    port,
    historyApiFallback: true,
    // open: true,
    ...(isHTTPS ? {
      server: {
        type: 'https',
        options: {
          ...(useRealCerts ? {
            // For testing with Cordova and real authoritative certs
            key: fs.readFileSync(`./${source}/cert/wevotedeveloper.com_key.txt`),
            cert: fs.readFileSync(`./${source}/cert/wevotedeveloper.com.crt`),
          } : {
            key: fs.readFileSync(`./${source}/cert/server.key`),
            cert: fs.readFileSync(`./${source}/cert/server.crt`),
          }),
        },
      },
    } : {}),
  },
});
