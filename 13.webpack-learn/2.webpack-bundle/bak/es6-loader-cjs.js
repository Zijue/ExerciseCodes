(() => {
    var modules = ({
        "./src/title.js":
            ((module) => {
                module.exports = {
                    name: 'title_name',
                    age: 'title_age'
                }
            })
    });
    var cache = {};
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
        require.n = (module) => {
            // 如果是引入的是ES6模块，就返回模块的default属性的值，否则返回模块对象
            var getter = module && module.__esModule ?
                () => (module['default']) :
                () => (module);
            require.d(getter, { a: getter });
            return getter;
        };
    })();
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
        "use strict";
        require.r(exports);
        debugger;
        var _title__WEBPACK_IMPORTED_MODULE_0__ = require("./src/title.js");
        var _title__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/require.n(_title__WEBPACK_IMPORTED_MODULE_0__);
        console.log((_title__WEBPACK_IMPORTED_MODULE_0___default()));
        console.log(_title__WEBPACK_IMPORTED_MODULE_0__.age);
    })();
})();