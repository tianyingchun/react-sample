'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function baseConfig() {
  return {
    entry: {
      // for convenience, we should always define libaray as react-kits entry.
      library: ['react', 'redux', 'react-redux', 'redux-logger'],
      // customized module entry definitions.
    },
    module: {
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
        filename: 'reactkits.js',
        minChunks: Infinity
      })
    ],
    output: {
      path: path.join(__dirname, 'public'),
      filename: '[name]/bundle.js',
    },
    resolve: {
      extensions: ['', '.js']
    }
  };
};
