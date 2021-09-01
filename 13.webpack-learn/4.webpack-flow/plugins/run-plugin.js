class RunPlugin {
    // 每个插件都是一个类，而每个类都需要定义一个apply方法
    apply(compiler) {
        // 将此插件与webpack的run事件绑定
        compiler.hooks.run.tap('RunPlugin', () => {
            console.log('run: 开始编译')
        })
    }
}
module.exports = RunPlugin;