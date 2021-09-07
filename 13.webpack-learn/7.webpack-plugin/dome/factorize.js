/**
 * 在webpack模块是如何生产创建的
 * AsyncSeriesBailHook异步串行带保险的钩子
 */
let { AsyncSeriesBailHook } = require('tapable');
//根据模块描述生产模块
let factorize = new AsyncSeriesBailHook(["moduleName"]);
factorize.tapAsync('exteralModuleFactory', (moduleName, callback) => {
    if (moduleName === 'jquery') {
        callback(null, { type: 'exteralModule', name: moduleName });
    } else {
        callback(null);
    }
});
factorize.tapAsync('normalModuleFactory', (moduleName, callback) => {
    callback(null, { type: 'normalModule', name: moduleName });
});
factorize.callAsync('lodash', (err, module) => {
    console.log(module);
});