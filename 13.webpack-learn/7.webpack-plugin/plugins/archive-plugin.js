const Jszip = require('jszip');
const path = require('path');
const { Compilation, sources } = require('webpack');
// 归档插件，打包输出的文件，压缩后归档
class ArchivePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        // 输出 asset 到 output 目录之前执行
        // https://webpack.docschina.org/api/compiler-hooks/#emit
        compiler.hooks.emit.tapPromise('ArchivePlugin', (compilation) => {
            let jszip = new Jszip();
            // assets对象：key文件名；value文件的内容；它里面存放着所有将要输出到目录的文件
            let assets = compilation.assets;
            for (let filename in assets) {
                const source = assets[filename].source();
                jszip.file(filename, source);
            }
            return jszip.generateAsync({ type: 'nodebuffer' }).then(content => {
                let filename = this.options.filename.replace('[timestamp]', Date.now() + '');
                assets[filename] = {
                    source() {
                        return content;
                    }
                }
            })
        });
        /** 上诉代码的问题
            [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: Compilation.assets will be frozen in future, all modifications are deprecated.
        BREAKING CHANGE: No more changes should happen to Compilation.assets after sealing the Compilation.    
                Do changes to assets earlier, e. g. in Compilation.hooks.processAssets.
                Make sure to select an appropriate stage from Compilation.PROCESS_ASSETS_STAGE_*.
        (Use `node --trace-deprecation ...` to show where the warning was created)
         */
        // 下面这段代码不成功，webpack的钩子理解还是不够透彻 -- compilation的事件绑定位置不正确
        // compiler.hooks.emit.tap('ArchivePlugin', (compilation) => {
        //     compilation.hooks.processAssets.tapPromise(
        //         {
        //             name: 'ArchivePlugin',
        //             stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        //             additionalAssets: true
        //         }, (assets) => {
        //             for (let filename in assets) {
        //                 const asset = compilation.getAsset(filename);
        //                 const source = asset.source.source();
        //                 jszip.file(filename, source);
        //             }
        //             return jszip.generateAsync({ type: 'nodebuffer' }).then(content => {
        //                 let filename = this.options.filename.replace('[timestamp]', Date.now() + '');
        //                 compilation.updateAsset(
        //                     filename,
        //                     new sources.RawSource(content)
        //                 )
        //             })
        //         }
        //     )
        // })
    }
}
module.exports = ArchivePlugin;