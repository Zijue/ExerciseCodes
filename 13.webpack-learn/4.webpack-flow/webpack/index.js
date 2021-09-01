const Compiler = require("./compiler");

function webpack(options) {
    // 1.初始化参数：从配置文件和shell语句中读取并合并参数，得到最终的配置项
    let argv = process.argv.slice(2); // 前两项我们不需要，只需要取后面shell传递的参数 ['node.exe', 'debugger.js', '--mode=development', '--entry=./src/title.js']
    let shellOptions = argv.reduce((shellOptions, option) => {
        let [key, value] = option.split('='); // ['--mode', 'development']...
        shellOptions[key.slice(2)] = value;
        return shellOptions;
    }, {});
    // webpack中通过webpack.merge完成参数的合并，这里简单处理，不做深究
    let finalOptions = { ...options, ...shellOptions };
    // 2.用上一步得到的参数初始化Compiler对象
    let compiler = new Compiler(finalOptions);
    // 3.加载所有配置的插件
    let { plugins } = finalOptions;
    debugger;
    for (let plugin of plugins) {
        plugin.apply(compiler);
    }
    return compiler;
}
module.exports = webpack;