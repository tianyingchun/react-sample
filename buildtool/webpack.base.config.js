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
        { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader") },
        // extract less files using stylus loader
        { test: /\.styl$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!stylus-loader") },
        // Optionally extract less files using less loader
        { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader") },

        // inline base64 URLs for <=5k images, direct URLs for the rest, >-5k leave asset file to dist dir.
        { test: /\.(png|jpg)$/, loader: "url-loader", query:{ limit: 5000, context:'${projectName}/stylesheets', name:'${projectName}/[path][name].[ext]' } }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new ExtractTextPlugin("[name]/bundle.css", { allChunks: true }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'library',
        filename: 'reactkits.js',
        minChunks: Infinity
      })
    ],
    output: {
      path: path.join(__dirname, 'public'),
      filename: '[name]/bundle.js'
      // publicPath: 'http://cdn.xx.com/public/'
    },
    resolve: {
      extensions: ['', '.js']
    }
  };
};
