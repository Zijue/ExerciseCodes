const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'), // 此处可以写相对路径，默认值为：./src/index.js
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出必须写绝对路径
        filename: 'main.js'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
}