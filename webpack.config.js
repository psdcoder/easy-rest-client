'use strict';

const webpack = require('webpack');
const plugins = [new webpack.optimize.OccurrenceOrderPlugin()];

if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
        ]
    },
    output: {
        library: 'easyRestClient',
        libraryTarget: 'umd'
    },
    plugins: plugins
};
