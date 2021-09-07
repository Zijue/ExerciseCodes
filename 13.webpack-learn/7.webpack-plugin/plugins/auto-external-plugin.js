const { ExternalModule } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * 1.需要向输出html文件中添加CDN脚本引用
 * 2.再打包生产模块的时候，截断正常的打包逻辑，变成外部依赖模块
 */
class AutoExternalPlugin {
    constructor(options) {
        this.options = options;
        this.externalModules = Object.keys(this.options); // ['jquery', 'lodash']
        this.importedModules = new Set(); // 存放着所有的实际真正使用到的外部依赖模块
    }
    apply(compiler) {
        // 每种模块会对应一个模块工厂
        // https://webpack.docschina.org/api/normalmodulefactory-hooks/
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
            // 1.收集代码中引入的扩展模块
            // https://webpack.docschina.org/api/parser/#root
            normalModuleFactory.hooks.parser
                .for('javascript/auto') // 普通的js文件对应的钩子就是javascript/auto
                .tap('AutoExternalPlugin', parser => {
                    // 在parser遍历语法的过程中，如果遍历到了import节点
                    // https://webpack.docschina.org/api/parser/#import
                    parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
                        if (this.externalModules.includes(source)) {
                            this.importedModules.add(source);
                        }
                    });
                    // https://webpack.docschina.org/api/parser/#call
                    // call=HookMap key方法名 值是这个方法对应的钩子
                    parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
                        let value = expression.arguments[0].value;
                        if (this.externalModules.includes(value)) {
                            this.importedModules.add(value);
                        }
                    });
                });
            // 2.改造模块的生产过程，如果是外链模块，就直接生产一个外链模块返回
            // https://webpack.docschina.org/api/normalmodulefactory-hooks/
            normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
                let { request } = resolveData; // 模块名 jquery lodash
                if (this.externalModules.includes(request)) {
                    let { variable } = this.options[request];
                    // 创建扩展模块，向下传递；request=jquery window.jQuery
                    callback(null, new ExternalModule(variable, 'window', request)); // 异步串行保险钩子，此处返回值之后，就不继续向下执行
                } else {
                    callback(null); // 必须调用，不然后续钩子不会执行
                }
            })
        });
        // 往输出的html页面中添加一个新的CDN引用的script标签
        compiler.hooks.compilation.tap('AutoExternalPlugin', compilation => {
            // 获取HtmlWebpackPlugin对compilation扩展的钩子
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin', (htmlData, callback) => {
                Reflect.ownKeys(this.options).filter(key => this.importedModules.has(key)).forEach(key => {
                    // 添加jquery
                    htmlData.assetTags.scripts.unshift({
                        tagName: 'script',
                        voidTag: false,
                        attributes: {
                            defer: false,
                            src: this.options[key].url
                        }
                    })
                });
                callback(null, htmlData);
            })
        })
    }
}
module.exports = AutoExternalPlugin;