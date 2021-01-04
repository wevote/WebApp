/* jshint esversion: 6 */
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const path = require('path');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
// const webpack = require('webpack');
const { ids } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');   // Don't delete this!
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const port = process.env.PORT || 3000;
const single = process.env.BUNDLE && process.env.BUNDLE === 'SINGLE';
const isHTTPS = process.env.PROTOCOL && process.env.PROTOCOL === 'HTTPS';

// Set isProduction to false, to enable the interactive bundle analyser and the Unused component analyzer
const isProduction = true;   // Developers can set this to be false, but in git it should always be true

module.exports = {
  // mode: isHTTPS ? 'production' : 'development',
  mode: 'development',
  entry: {
    bundle: ['./src/js/index.js', './src/sass/main.scss'],
  },
  output: (single ? {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  } : {
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  }),
  optimization: (single ? {
    removeAvailableModules: true,
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
  } : {
    removeAvailableModules: true,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        reactCore: {
          name: 'reactCore',
          test: /[\\/]node_modules[\\/](jquery|prop-types|react|react-dom|react-helmet|react-router|react-router-scroll|react-text-truncate)[\\/]/,
          chunks: 'all',
          enforce: true,
        },
        materialStyle: {
          name: 'materialStyle',
          test: /[\\/]node_modules[\\/](@material-ui|styled-components)[\\/]/,
          chunks: 'all',
          enforce: true,
        },
        readyNoApi: {
          name: 'readyNoApi',
          // eslint-disable-next-line consistent-return
          test: (module) => {
            if (module.resource) {
              return module.resource.includes('/js/config.js') ||
                module.resource.includes('/js/index.js') ||
                module.resource.includes('/js/mui-theme.js') ||
                module.resource.includes('/js/Root.jsx') ||
                module.resource.includes('/js/startReactApp.js') ||
                module.resource.includes('/js/styled-theme.js') ||
                module.resource.includes('/js/components/ReadyNoApi/') ||
                module.resource.includes('/js/components/Widgets/ReadMore.jsx') ||
                module.resource.includes('/js/routes/ReadyNoApi.jsx') ||
                module.resource.includes('/js/utils/') ||
                module.resource.match(/[\\/]node_modules[\\/](@babel|clsx|create-react-class|css-vendor|dom-helpers|@emotion|exenv|fbjs|history|hoist-non-react-statics|hyphenate-style-name|invariant|is-in-browser|is-what|jss|jss-plugin-camel-case|jss-plugin-default-unit|jss-plugin-global|jss-plugin-nested|jss-plugin-props-sort|jss-plugin-vendor-prefixer|jss-plugin-rule-value-function|memoize-one|merge-anything|object-assign|process|query-string|react-is|react-fast-compare|react-js|react-side-effect|scroll-behavior|shallowequal|sockjs-client|strict-uri-encode|stylis|stylis-rule-sheet|tiny-warning)[\\/]/);
            }
          },
          chunks: 'all',
          enforce: true,
        },
        // 2020-07-17 Dale: After a lot of testing, breaking up into these multiple bundles does not make the bundles load faster
        // weVoteWidgets: {
        //   name: 'weVoteWidgets',
        //   test: function (module) {
        //     if (module.resource) {
        //       return module.resource.includes('/js/components/Widgets');
        //     }
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        // weVoteReady: {
        //   name: 'weVoteReady',
        //   test: function (module) {
        //     if (module.resource) {
        //       return module.resource.includes('/js/routes/Ready.jsx') ||
        //         module.resource.includes('/js/routes/ReadyRedirect.jsx') ||
        //         module.resource.includes('/js/components/Ready/');
        //     }
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        // weVoteStoresAndActions: {
        //   name: 'weVoteStoresAndActions',
        //   test: function (module) {
        //     if (module.resource) {
        //       return module.resource.includes('/js/actions') ||
        //         module.resource.includes('/js/stores');
        //     }
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        // weVoteBallot: {
        //   name: 'weVoteBallot',
        //   test: function (module) {
        //     if (module.resource) {
        //       return module.resource.includes('/js/routes/Ballot') ||
        //         module.resource.includes('/js/components/Ballot') ||
        //         module.resource.includes('/js/routes/VoterGuide') ||
        //         module.resource.includes('/js/components/VoterGuide');
        //     }
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        // weVoteSettings: {
        //   name: 'weVoteSettings',
        //   test: function (module) {
        //     if (module.resource) {
        //       return module.resource.includes('/js/routes/Settings') ||
        //         module.resource.includes('/js/components/Settings');
        //     }
        //   },
        //   chunks: 'all',
        //   enforce: true,
        // },
        defaultWeVote: {
          name: 'defaultWeVote',
          // eslint-disable-next-line consistent-return
          test: (module) => {
            if (module.resource) {
              return module.resource.includes('/js/');
            }
          },
          chunks: 'all',
          enforce: true,
          priority: -10,
        },
        defaultVendors: {
          name: 'defaultVendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true,
          priority: -10,
        },
      },
    },
    // minimizer: [
    //   new UglifyJsPlugin({
    //     sourceMap: true,
    //     uglifyOptions: {
    //       ecma: 8,
    //       mangle: false,
    //       keep_classnames: true,
    //       keep_fnames: true,
    //     },
    //   }),
    // ],
  }),
  plugins: [
    // new CleanWebpackPlugin(),
    // ...(single ? [] : [
    //   new ids.HashedModuleIdsPlugin(),
    // ]),
    new HtmlWebpackPlugin(single ? {
      template: './src/index.html',
    } : {
      template: './src/index.html',
      filename: 'index.html',
      chunksSortMode: 'auto',
    }),
    ...(single ? [] : [
      new ScriptExtHtmlWebpackPlugin({
        sync: ['jQuery', 'materialStyle', 'reactCore', 'readyNoApi'],
        // This just generates a link, but doesn't remove the script from being included and holding up onload
        // Causes additional 2 second delay
        // prefetch: {
        //   test: ['defaultVendors', 'defaultWeVote'],
        //   chunks: 'all',
        // },
        defaultAttribute: 'async',
      }),
    ]),
    new CopyPlugin({
      patterns: [
        { from: 'src/extension.html', to: '.' },
        { from: 'src/robots.txt', to: '.' },
        { from: 'src/css/', to: 'css/' },
        {
          from: 'src/img',
          to: 'img/',
          globOptions: { ignore: ['DO-NOT-BUNDLE/**/*', 'welcome/partners/**/*'] },
        },
        {
          from: 'src/javascript/',
          to: 'javascript/',
        },
      ],
    }),
    // Strip from bundle.js, all moment.js locales except “en”
    new MomentLocalesPlugin(),
    // December 2020: 40MB is too big, but what is needed today
    new InjectManifest({
      swSrc: './src/serviceWorker.js',
      swDest: 'sw.js',
      maximumFileSizeToCacheInBytes: 40000000,
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
  devServer: (isHTTPS ? {
    https: {
      key: fs.readFileSync('./src/cert/server.key'),
      cert: fs.readFileSync('./src/cert/server.crt'),
    },
    host: 'localhost',
    port,
    historyApiFallback: true,
    open: true,
  } : {
    host: 'localhost',
    port,
    historyApiFallback: true,
    open: true,
  }),
  // devtool: isHTTPS ? 'source-map' : 'inline-cheap-module-source-map',
  devtool: 'inline-cheap-module-source-map',
};
