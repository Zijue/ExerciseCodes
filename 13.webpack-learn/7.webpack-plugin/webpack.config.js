const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DonePlugin = require('./plugins/done-plugin');
const AssetPlugin = require('./plugins/asset-plugin');
const ArchivePlugin = require('./plugins/archive-plugin');
const AutoExternalPlugin = require('./plugins/auto-external-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new AutoExternalPlugin({
            jquery: { // 自动把jquery模块变成一个外部依赖模块
                variable: 'jQuery', // 不再打包，而是从window.jQuery变量上获取jquery对象
                url: 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js' // CDN脚本
            },
            lodash: { // 自动把lodash模块变成一个外部依赖模块
                variable: '_', // 不再打包，而是从window._变量上获取lodash对象
                url: 'https://cdn.bootcss.com/lodash/3.1.0/lodash.js' // CDN脚本
            }
        })
        // new DonePlugin(),
        // new AssetPlugin(),
        // new ArchivePlugin({
        //     filename: '[timestamp].zip'
        // }),
    ]
}