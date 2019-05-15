/* eslint-disable */
const path = require('path');
const DtsBundleWebpack = require('dts-bundle-webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'jansengine.js',
        library: 'jansengine',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /(node-modules|bower_components)/
            }
        ]
    },
    devtool: 'eval-source-map',
    plugins: [
        new DtsBundleWebpack({
            // see dts-bundle-webpack npm page for options
            name: 'Jansengine',
            main: './src/index.ts',
            out: '../dist/jansengine.d.ts',
            removeSource: true,
            outputAsModuleFolder: true
        })
    ]
};
