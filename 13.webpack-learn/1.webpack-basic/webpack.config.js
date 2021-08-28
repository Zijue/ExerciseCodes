const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// console.log('webpack: ', process.env.NODE_ENV);
module.exports = {
    mode: 'development',
    devtool: false, // 不生成sourcemap，关掉内部生产sourcemap的逻辑，使用自己更精细化控制生成的过程
    // devtool: 'hidden-source-map', // 生产环境使用；生成单独的sourcemap文件，但是不在main.js中建立关联。当后续需要调试的时候，可以通过浏览器的 Add source map 添加关联
    entry: './src/index.js', // 此处可以写相对路径，默认值为：./src/index.js
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出必须写绝对路径
        filename: 'main.js',
        // publicPath 表示的是打包生成的index.html文件里面引用资源的前缀
        // publicPath: 'zijue' // <script defer src="zijue/main.js"></script></head>
    },
    // watch: true, // 默认false，不开启
    // watchOptions: { // 只有当watch=true时，此配置项才有意义
    //     ignored: /node_modules/, // 默认为空，表示不监听哪些文件或者文件夹，支持正则匹配
    //     aggregateTimeout: 300, // 监听到变化发生后会等300ms再去执行，默认300ms（防抖）
    //     poll: 1000 // 判断文件是否发生变化，是通过不停的轮询文件系统是否有变化实现的，默认每秒问1000次
    // },
    devServer: { // 内部就是一个express服务器
        static: path.resolve(__dirname, 'static'), // 额外的静态文件的根目录，在开发服务器下静态代理static文件夹
        compress: true, // 是否启动压缩
        port: 8080, // 配置http服务预览的端口号，如果不设置，默认就是8080
        open: true, // 编译成功后，会自动打开浏览器进行预览
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // },
        // 如果我们没有代理服务器，可以使用onBeforeSetupMiddleware
        onBeforeSetupMiddleware(devServer) {
            // devServer.app本身就是一个express服务器
            devServer.app.get('/api/users', (req, res, next) => {
                res.json([{ id: 1 }, { id: 2 }])
            })
        }
    },
    // 如果我们想引用一个库，但是又不想让webpack打包，并且不影响使用，就可以使用externals
    externals: {
        jquery: 'jQuery'
    },
    resolve: {
        alias: { // 别名，可以在url引入中使用，例如：background-image: url(@/images/cyt.jpg)
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            // { // 此处也可以不写，使用行内loader的方式（inline）
            //     test: require.resolve('lodash'),
            //     loader: 'expose-loader',
            //     options: {
            //         exposes: {
            //             globalName: '_',
            //             override: true
            //         }
            //     }
            // },
            // use的意思是使用哪些loader进行转换，转换顺序从右往左
            // 最右边的loader接收源文件，最左侧的loader返回一个JS脚本
            // 为什么不用一个loader干所有的事情，而是把几个小loader串联起来使用，loader有一个单一原则，每个loader只做单一一件事情
            { test: /\.txt$/, use: 'asset/source' /**代替raw-loader */ },
            // { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
            // { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            // 处理CSS兼容性 -- 使用postcss-loader
            // { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
            // { test: /\.less$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] },
            // { test: /\.scss$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] },
            // 提取css文件，需要将style-loader替换成MiniCssExtractPlugin.loader
            // {
            //     test: /\.css$/, use: [MiniCssExtractPlugin.loader, {
            //         loader: 'css-loader',
            //         options: {
            //             modules: { // 启用css-module
            //                 mode: 'local'
            //             }
            //         }
            //     }, 'postcss-loader']
            // },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
            { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'] },
            { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] },
            {
                test: /\.(jpg|png|bmp|gif|svg)$/,
                /** webpack5中使用asset模块代替raw-loader、file-loader、url-loader
                 * https://webpack.docschina.org/guides/asset-modules/#source-assets
                 */
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4kb
                    }
                }
                // use: [{
                //     // loader: 'file-loader', // 可以把src目录里依赖的源图片文件拷贝到目标目录里去，文件名一般为新的hash值

                //     loader: 'url-loader', // url-loader可以配置参数
                //     options: {
                //         esModule: false, // 设置为false，图片使用不需要加.default
                //         name: '[hash:8].[ext]',
                //         limit: 8 * 1024, // 如果文件太小，不需要拷贝文件，也不需要发http请求，只需要把文件变成base64字符串内嵌到html页面中
                //         // outputPath: 'images', // 指定输出的目录
                //         // publicPath: '/images' // 指定引入的目录
                //     }
                // }]
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
        // 通过插件更精细化的控制sourcemap生成，先将devtool设为false
        new webpack.SourceMapDevToolPlugin({
            // 向输出文件里添加的映射文本：\n//# sourceMappingURL=http://127.0.0.1:8081/main.js.map
            append: '\n//# sourceMappingURL=http://127.0.0.1:8081/[url]',
            filename: '[file].map' // main.js => main.js.map
        }),
        /** 测试环境sourcemap配置
            通过webpack.SourceMapDevToolPlugin、FileManagerPlugin插件，webpack打包依旧生成sourcemap文件，
            但是将.map文件挑出来放到指定的服务器中，将不含有.map文件的dist目录部署到服务器；即实现了源码的可调试，
            又不会暴露sourcemap，提高了安全性。
        */
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [{
                        source: './dist/*.map',
                        destination: path.resolve(__dirname, 'sourcemaps')
                    }],
                    delete: ['./dist/*.map']
                }
            }
        }),
        // 自动向模块内注入一个第三方模块，相当于自动完成了import _ from 'lodash';
        // new webpack.ProvidePlugin({
        //     _: 'lodash' // 此方式引入的是一个模块内的变量，不在全局上；想放到全局上需要使用expose-loader
        // }),
        new webpack.BannerPlugin('紫珏'), // 添加商标
        // new CopyWebpackPlugin({ // 静态资源拷贝
        //     patterns: [{
        //         from: path.resolve(__dirname, 'src/static'), // 静态资源目录源地址
        //         to: path.resolve(__dirname, 'dist/static'), // 目标地址
        //     }]
        // }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
}