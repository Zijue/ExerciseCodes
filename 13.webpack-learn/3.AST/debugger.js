// debugger调试webpack打包工具
const webpack = require('webpack');
const options = require('./webpack.config');
debugger; // 设置断点，点击vscode左侧面板的执行按钮
const compiler = webpack(options);
compiler.run((err, stats) => {
    console.log(err);
    console.log(
        JSON.stringify(
            stats.toJson({
                assets: true,
                chunks: true,
                modules: true,
                entries: true
            })
        )
    )
})