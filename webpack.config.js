const HtmlWebpackPlugin = require('html-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');   // Don't delete this!
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const port = process.env.PORT || 3000;

// Set isProduction to false, to enable the interactive bundle analyser and the Unused component analyzer
const isProduction = true;   // Developers can set this to be false, but in git it should always be true

// , './src/sass/loading-screen.scss'  // Deprecated by Dale
// When we include the core bundle, its' Root file takes over routing once it loads.
// What we want is for the bundle without API calls to fully load before we start loading
// larger bundle.js in the background.
//     bundle: ['./src/js/index.js', './src/sass/main.scss'],
//     readyBundle: ['./src/js/startReactReadyApp.js', './src/sass/main.scss'],

// Dale 2020-06 When I try to use optimization (chunks-webpack-plugin), the routes file within readyBundle doesn't seem get used.
//     "chunks-webpack-plugin": "^6.1.0",

//   optimization: {
//     splitChunks: {
//       chunks: 'all',
//       name: false,
//     },
//   },

// To switch back to readyBundle
//     readyBundle: ['./src/js/startReactReadyApp.js', './src/sass/main.scss'],
module.exports = {
  mode: 'development',
  entry: {
    bundle: ['./src/js/index.js', './src/sass/main.scss'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin([
      { from: 'src/extension.html', to: '.' },
      { from: 'src/robots.txt', to: '.' },
      { from: 'src/css/', to: 'css/' },
      { from: 'src/img/',
        to: 'img/',
        ignore: ['DO-NOT-BUNDLE/**/*', 'welcome/partners/**/*' ],
      },
      { from: 'src/javascript/', to: 'javascript/' },
    ]),
    // Strip from bundle.js, all moment.js locales except “en”
    new MomentLocalesPlugin(),
    new InjectManifest({
      swSrc: './src/serviceWorker.js',
      swDest: 'sw.js',
    }),
    ...(isProduction ? [] : [
      new UnusedWebpackPlugin({  // Set isProduction to false to list (likely) unused files
      // Source directories and files, to exclude from unused file checking
        directories: [path.join(__dirname, 'src')],
        exclude: [
          '**/cert/',
          '**/DO-NOT-BUNDLE/',
          '**/endorsement-extension/',
          '**/global/photos/',
          '**/global/svg-icons/',
          '*.test.js',
          'config-template.js',
          'extension.html',
          'robots.txt',
          'vip.html',
        ],
        // Root directory (optional)
        root: __dirname,
      }),
      new BundleAnalyzerPlugin(), // Set isProduction to false to start an (amazing) bundle size analyzer tool
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].css',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'css-loader?-url',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg|eot|woff|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/',
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    host: 'localhost',
    port,
    historyApiFallback: true,
    open: true,
    writeToDisk: true,
  },
  devtool: 'inline-cheap-module-source-map',
};
