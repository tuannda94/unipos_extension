const path = require("path");
const webpack = require('webpack');

module.exports = [
  {
    entry: {
      app: [
        "./node_modules/bootstrap/dist/js/bootstrap.js",
        "./assets/js/app.js"
      ],
      background: "./assets/js/background.js"
    },
    output: {
      filename: "./public/js/[name].js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        }
      ]
    },
    mode: 'development',
    resolve: {
      alias: {
        codebaseDir: path.resolve(__dirname, 'assets/js/codebases'),
        frameworkDir: path.resolve(__dirname, 'assets/js/framework'),
        sourceDir: path.resolve(__dirname, 'assets')
      }
    },
    plugins:[
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
          $: 'jquery',
          jquery: 'jquery'
      })
    ]
  }
];
