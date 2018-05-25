const path = require("path");

module.exports = {
	entry: [
		"./assets/js/app.js",
		"./assets/css/app.css"
	],
  	output: {
  		filename: "./public/js/app.js"
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
    }
};
