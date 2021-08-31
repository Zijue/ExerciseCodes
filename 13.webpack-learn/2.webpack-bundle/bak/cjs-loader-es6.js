// commonjs加载ES6模块，webpack打包的结果
(() => {
    var modules = ({
        "./src/title.js":
            ((module, exports, require) => {
                require.r(exports); // r方法，将导出的模块标识为__esModule
                require.d(exports, { // 通过代理的方式取值，好处在异步加载中体现
                    "default": () => (DEFAULT_EXPORT),
                    "age": () => (age)
                });
                const DEFAULT_EXPORT = ('title_name');
                const age = 'title_age';
            })
    });
    var cache = {}; // 模块的缓存
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
    (() => {
        require.d = (exports, definition) => {
            for (var key in definition) {
                if (require.o(definition, key) && !require.o(exports, key)) {
                    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                }
            }
        };
    })();
    (() => {
        require.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    })();
    (() => {
        require.r = (exports) => {
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            }
            Object.defineProperty(exports, '__esModule', { value: true });
        };
    })();
    var exports = {};
    (() => {
        let title = require("./src/title.js");
        console.log(title);
        console.log(title.age);
    })();
})();