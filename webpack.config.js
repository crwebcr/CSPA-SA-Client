var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var postcssGradientFixer = require('postcss-gradientfixer') 

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080/', 
    'webpack/hot/only-dev-server', 
    './src/js/main.js'
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader?sourceMap' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ['babel'],
        query: {
          'presets': ['react', 'es2015'],
          'plugins': ['transform-object-rest-spread']
        }
      }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer({ browsers: ['> 5%'] }), postcssGradientFixer]
  },  
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/dist',
    filename: './js/cspa.js'
  }
}