const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const port = process.env.PORT || 3000;

module.exports = {
  mode: 'development',
  entry: ['./src/js/index.js', './src/sass/loading-screen.scss', './src/sass/main.scss'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin([
      { from: 'src/javascript/', to: 'javascript/' },
      { from: 'src/img/global/icons/', to: 'img/global/icons/' },
      { from: 'src/img/global/intro-story/', to: 'img/global/intro-story/' },
      { from: 'src/img/global/logos/', to: 'img/global/logos/' },
      { from: 'src/img/global/photos/', to: 'img/global/photos/' },
      { from: 'src/img/global/svg-icons/', to: 'img/global/svg-icons/' },
      { from: 'src/img/how-it-works/', to: 'img/how-it-works/' },
      { from: 'src/img/tools/', to: 'img/tools/' },
      { from: 'src/img/welcome/', to: 'img/welcome/' },
      { from: 'src/img/welcome/benefits/', to: 'img/welcome/benefits/' },
      { from: 'src/img/welcome/partners/', to: 'img/welcome/partners/' },
      { from: 'src/img/endorsement-extension/', to: 'img/endorsement-extension/' },
      { from: 'src/vip.html', to: '.' },
      { from: 'src/css/', to: 'css/' },
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
  devtool: 'cheap-inline-module-source-map',
};
