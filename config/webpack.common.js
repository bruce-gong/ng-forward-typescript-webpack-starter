// We will define separate configurations for development, production, and test environments.
// All three have some configuration in common.
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  // webpack will analyze your entry file for dependencies to other files. 
  // These files (called modules) are included in your bundle.js too. 
  // webpack will give each module a unique id and save all modules accessible by id in the bundle.js file. 
  // Only the entry module is executed on startup. A small runtime provides the require function and executes the dependencies when required
  entry: {
    // 'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/app.ts'
  },
  // Most import statements won't mention the extension.
  // So we tell Webpack to resolve module file requests by looking for matching files with
  // 1. an explict extension; 2 .js extension; 3. .ts extension
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  // specify the loaders
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ]
  },

// Our application code imports vendor code. Webpack is not smart enough to keep the vendor code out of the app.js bundle.
// We rely on the CommonsChunkPlugin to do that job.
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
      // name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
