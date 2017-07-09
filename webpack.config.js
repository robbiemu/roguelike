const path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  context: __dirname + "/app",

  entry: {
    javascript: "./components/Game.jsx"
  },

  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },

  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    modules: [__dirname, 'node_modules'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["react-hot-loader", "babel-loader"],
      }
    ],
  },
}