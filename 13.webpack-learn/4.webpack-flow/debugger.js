const webpack = require("./webpack/index");
const options = require("./webpack.config");
const compiler = webpack(options);
compiler.run((err, stats) => {
    console.log(err);
    // console.log(stats);
    console.log(
        JSON.stringify(
            stats.toJson({
                assets: true, //资源
                chunks: true, //代码块
                modules: true, //模块
                entries: true, //入口
            }),
            null,
            2
        )
    );
});
