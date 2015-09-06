'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function baseConfig() {
  return {
    entry: {
      library: ['react', 'redux', 'react-redux'],
      bundle: ['./workspace/app/member']
    },
    eslint: {
      quiet: true,
      configFile: './.eslintrc'
    },
    module: {
      preLoaders: [
        // ESlint
        { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
      ],
      loaders: [
        // Extract css files
        // Use the autoprefixer-loader
        { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader")},
        // extract less files using stylus loader
        { test: /\.styl$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!stylus-loader")},
        // Optionally extract less files using less loader
        { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader")}
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new ExtractTextPlugin("[name].css"),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'library',
        filename: 'react-kits.js',
        minChunks: Infinity
      })
    ],
    output: {
      path: path.join(__dirname, 'public'),
      filename: '[name].js',
      publicPath: 'http://localhost:3000/public/'
    },
    resolve: {
      extensions: ['', '.js']
    }
  };
};
