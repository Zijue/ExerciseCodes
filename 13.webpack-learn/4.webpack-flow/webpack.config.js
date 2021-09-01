const path = require('path');
const DonePlugin = require('./plugins/done-plugin');
const RunPlugin = require('./plugins/run-plugin')

module.exports = {
    mode: 'production',
    devtool: false,
    entry: { // 多入口打包
        entry1: './src/entry1.js',
        entry2: './src/entry2.js'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, 'loaders/zijue-loader.js')
                ]
            }
        ]
    },
    plugins: [
        new RunPlugin(), // 开始编译时触发run事件，RunPlugin会监听这个事件执行回调
        new DonePlugin(), // 编译完成时会触发done事件，DonePlugin会监听这个事件执行回调
    ]
}