const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DtsBundleWebpack = require('dts-bundle-webpack');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        jansengine: './src/index.ts',
        demo: './src/demo/demo.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: '[name]',
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
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
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
        }),  // bundle type files
        new webpack.NamedModulesPlugin(),  // clean build logs
        new HtmlWebpackPlugin({
            template: './src/demo/demo.html'
        }),  // use a html template for the demo
        new webpack.HotModuleReplacementPlugin()  // use hot resync
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        hot: true
    }
};
