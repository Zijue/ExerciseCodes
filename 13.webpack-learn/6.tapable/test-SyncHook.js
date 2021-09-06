const { SyncHook } = require("./tapable");
const hook = new SyncHook(["name", "age"]);
debugger;
hook.tap("1", (name, age) => {
    console.log(1, name, age);
    return 1;
});
hook.tap("2", (name, age) => {
    console.log(2, name, age);
    return 2;
});
hook.tap("3", (name, age) => {
    console.log(3, name, age);
    return 3;
});
debugger;
// console.log(hook.taps);
hook.call("zhufeng", 10); // call方法动态编译出一个‘call’方法执行
hook.call("zhufeng", 12); // 多次调用不会再动态编译了，而是会执行上一次编译出来的call方法
/** 动态编译出来的call如下
(function anonymous(name, age
) {
"use strict";
var _context;
var _x = this._x;
var _fn0 = _x[0];
_fn0(name, age);
var _fn1 = _x[1];
_fn1(name, age);
var _fn2 = _x[2];
_fn2(name, age);

})
 */