var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
	entry: './src/client/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index_bundle.js',
		publicPath: '/'
	},
	module: {
		loaders:[{ test: /\.(js)$/, use: 'babel-loader' }]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/client/index.html'
		})
	]
}

module.exports = config;