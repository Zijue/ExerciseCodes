const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// console.log('webpack: ', process.env.NODE_ENV);
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'), // 此处可以写相对路径，默认值为：./src/index.js
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出必须写绝对路径
        filename: 'main.js',
        // publicPath 表示的是打包生成的index.html文件里面引用资源的前缀
        // publicPath: 'zijue' // <script defer src="zijue/main.js"></script></head>
    },
    devServer: {
        static: path.resolve(__dirname, 'static'), // 额外的静态文件的根目录，在开发服务器下静态代理static文件夹
        compress: true, // 是否启动压缩
        port: 8080, // 配置http服务预览的端口号，如果不设置，默认就是8080
        open: true // 编译成功后，会自动打开浏览器进行预览
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('development'), // 一定需要使用JSON.stringify包裹
        //     'NODE_ENV': JSON.stringify('production')
        // }),
    ]
}