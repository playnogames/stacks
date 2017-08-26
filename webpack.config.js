var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
	entry: ['babel-polyfill', 'whatwg-fetch', './src/client/index.js'],
	output: {
		path: path.join(__dirname, '/build'),
		filename: 'index_bundle.js',
		publicPath: '/'
	},
	module: {
		loaders:[
			{ test: /\.(js)$/, use: 'babel-loader' },
			{ test: /\.(scss)$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/client/index.html'
		})
	]
}

module.exports = config;
