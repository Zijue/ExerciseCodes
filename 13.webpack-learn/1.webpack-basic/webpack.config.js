const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// console.log('webpack: ', process.env.NODE_ENV);
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js', // 此处可以写相对路径，默认值为：./src/index.js
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
            // use的意思是使用哪些loader进行转换，转换顺序从右往左
            // 最右边的loader接收源文件，最左侧的loader返回一个JS脚本
            // 为什么不用一个loader干所有的事情，而是把几个小loader串联起来使用，loader有一个单一原则，每个loader只做单一一件事情
            { test: /\.txt$/, use: 'raw-loader' },
            // { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
            // { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            // 处理CSS兼容性 -- 使用postcss-loader
            { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] },
            {
                test: /\.(jpg|png|bmp|gif|svg)$/, use: [{
                    // loader: 'file-loader', // 可以把src目录里依赖的源图片文件拷贝到目标目录里去，文件名一般为新的hash值

                    loader: 'url-loader', // url-loader可以配置参数
                    options: {
                        esModule: false, // 设置为false，图片使用不需要加.default
                        name: '[hash:8].[ext]',
                        limit: 8 * 1024, // 如果文件太小，不需要拷贝文件，也不需要发http请求，只需要把文件变成base64字符串内嵌到html页面中
                        // outputPath: 'images', // 指定输出的目录
                        // publicPath: '/images' // 指定引入的目录
                    }
                }]
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader', // 可以进行代码的检查，还需要配置.eslintrc.js文件
                /** enforce: pre/normal/post/inline  改变rules的执行顺序，默认从上到下
                 * 优先级 pre => normal => post；inline只是种写法
                 */
                enforce: 'pre', // loader的分类
                options: { fix: true }, // 如果发现有问题的可以自动修复
                exclude: /node_modules/ // 跳过匹配的文件检查
            },
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        // 如果使用的装饰器，就配插件，如果没使用就不用配了
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
                            ["@babel/plugin-proposal-private-methods", { loose: true }],
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                        ],
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('development'), // 一定需要使用JSON.stringify包裹
        //     'NODE_ENV': JSON.stringify('production')
        // }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }), // 每次打包前清空打包文件目录
    ]
}