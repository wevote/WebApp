const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');   // Don't delete this!
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const port = process.env.PORT || 3000;

// Set isProduction to false, to enable the interactive bundle analyser and the Unused component analyzer
const isProduction = true;   // Developers can set this to be false, but in git it should always be true

// , './src/sass/loading-screen.scss'  // Deprecated by Dale
// When we include the core bundle, its' Root file takes over routing once it loads.
// What we want is for the bundle without API calls to fully load before we start loading
// larger bundle.js in the background.
//     bundle: ['./src/js/index.js', './src/sass/main.scss'],
//     getReady: ['./src/js/startReactReadyApp.js', './src/sass/main.scss'],

// Dale 2020-06 When I try to use optimization (chunks-webpack-plugin), the routes file within getReady doesn't seem get used.
//     DEPRECATED: "chunks-webpack-plugin": "^6.1.0", // This is based on "entry" only
//     "webpack-split-chunks": "^0.2.1",

//   optimization: {
//     splitChunks: {
//       chunks: 'all',
//       name: false,
//     },
//   },

// To switch back to getReady
//     getReady: ['./src/js/startReactReadyApp.js', './src/sass/main.scss'],
//     getReady: ['./src/js/startReactReadyApp.js'],
module.exports = {
  mode: 'development',
  entry: {
    bundle: ['./src/js/index.js', './src/sass/main.scss'],
  },
  output: {
    chunkFilename: '[name].bundle.[contenthash:8].js',
    filename: '[name].bundle.[contenthash:8].js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        components: {
          name: 'components',
          test: /[\\/]js[\\/]components[\\/]/,
          enforce: true,
        },
        stores: {
          name: 'stores',
          test: /[\\/]stores[\\/]/,
          enforce: true,
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          // name(module) {
          //   // Thanks to David Gilbertson: https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
          //   // get the name. E.g. node_modules/packageName/not/this/part.js
          //   // or node_modules/packageName
          //   const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          //
          //   // npm package names are URL-safe, but some servers don't like @ symbols
          //   return `npm.${packageName.replace('@', '')}`;
          // },
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          ecma: 8,
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunksSortMode: 'none',
    }),
    new CopyPlugin([
      { from: 'src/extension.html', to: '.' },
      { from: 'src/robots.txt', to: '.' },
      { from: 'src/css/', to: 'css/' },
      { from: 'src/img/',
        to: 'img/',
        ignore: ['DO-NOT-BUNDLE/**/*', 'welcome/partners/**/*'],
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
