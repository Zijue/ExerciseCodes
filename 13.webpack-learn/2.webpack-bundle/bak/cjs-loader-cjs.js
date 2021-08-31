// commonjs加载commonjs时，webpack打包的样式
(() => {
    // 模块的定义
    var modules = ({
        // key：模块id；此模块相对于项目根目录的相对路径
        // value：一个函数定义；本质上就是一个commonjs风格的函数（类似于 module exports）
        "./src/title.js":
            ((module) => {
                module.exports = 'title';
            })
    });
    var cache = {}; // 模块的缓存
    // webpack自己实现的require方法，用于加载一个模块，并且返回模块的导出结果，同时将结果放到缓存中，下次加载就直接从缓存结果中取值
    function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = cache[moduleId] = {
            exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
    }
    var exports = {};
    (() => {
        let title = require("./src/title.js");
        console.log(title);
    })();
})();