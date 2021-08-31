// 手写webpack5中异步加载打包逻辑
var modules = {}; // 存放着所有的模块定义；key是模块id，值是模块定义
var cache = {}; // 已经加载的模块的缓存
require.m = modules;

function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
        return cachedModule.exports; // 如果有缓存，则直接返回缓存的结果
    }
    var module = cache[moduleId] = {
        exports: {}
    };
    // 执行模块的定义方法，给module.exports赋值
    modules[moduleId](module, module.exports, require);
    return module.exports; // 最后返回module.exports对象
}
require.r = (exports) => { // 标记ES6模块
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
}
require.d = (exports, definition) => { // 对导出的内容取值做代理
    for (var key in definition) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
}
require.f = {};
require.p = '';
require.u = (chunkId) => chunkId + '.main.js';
require.l = (url) => {
    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}
// 表示已经安装好的或者加载中的代码块，值为0就表示已经加载完毕
var installedChunks = { main: 0 };
require.f.j = (chunkId, promises) => {
    var installedChunkData;
    var promise = new Promise((resolve, reject) => {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    promises.push(installedChunkData[2] = promise);
    // 这个就是JSONP要加载的脚本
    var url = require.p + require.u(chunkId); // src_hello_js.main.js
    // console.log(url);
    require.l(url); // 生成JSONP插入到页面中
}
// ensure 确保异步模块加载完成的方法
require.e = (chunkId) => {
    let promises = [];
    require.f.j(chunkId, promises);
    return Promise.all(promises)
}
var webpackJsonpCallback = (data) => { // data是二维数组
    var [chunkIds, moreModules] = data;
    var resolves = [];
    for (var i = 0; i < chunkIds.length; i++) {
        var chunkId = chunkIds[i];
        resolves.push(installedChunks[chunkId][0]); // 把promise的resolve方法取出放到resolves数组中
        installedChunks[chunkId] = 0; // 值置为0，表示此代码块已经加载完成了
    }
    for (var moduleId in moreModules) {
        require.m[moduleId] = moreModules[moduleId];
    }
    // 循环执行所有的resolve放阿飞，改变promise的状态使其完成
    while (resolves.length) {
        resolves.shift()();
    }
}
// 定义chunk加载的全局变量
var chunkLoadingGlobal = window['webpackChunk_2_bundle'] = [];
chunkLoadingGlobal.push = webpackJsonpCallback;
// index.js转换后的代码逻辑
let sayHello = document.getElementById('say');
sayHello.addEventListener('click', () => {
    require.e("src_hello_js").then(require.bind(require, "./src/hello.js")).then(result => {
        console.log(result.default);
    })
});

// 异步加载总结：
// 1.通过JsonP实现
// 2.用户在点击按钮时，生成对应的JsonP标签插入html中
// 3.对应脚本执行时，调用webpackJsonpCallback执行函数
// 4.回调函数执行过程中，将模块挂载到modules上，同时将promise状态设为成功态