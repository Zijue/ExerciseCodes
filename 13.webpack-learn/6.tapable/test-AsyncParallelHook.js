const { AsyncParallelHook } = require("./tapable");
let queue = new AsyncParallelHook(["name"]);
console.time("cost");
// 异步注册，全部任务完成后执行最终的回调
// queue.tapAsync("1", function (name, callback) {
//     setTimeout(function () {
//         console.log(1);
//         callback();
//     }, 1000);
// });
// queue.tapAsync("2", function (name, callback) {
//     setTimeout(function () {
//         console.log(2);
//         callback();
//     }, 2000);
// });
// queue.tapAsync("3", function (name, callback) {
//     setTimeout(function () {
//         console.log(3);
//         callback();
//     }, 3000);
// });
// queue.callAsync("zhufeng", (err) => {
//     console.log(err);
//     console.timeEnd("cost");
// });
/**
(function anonymous(name, age, _callback) {
  var _x = this._x;
  var _counter = 3; //计数器
  var _done = function () {
    _callback();    //表示call方法全部执行结束
  };
  var _fn0 = _x[0];
  _fn0(name, age, function () {
    if (--_counter === 0) _done();
  });
  var _fn1 = _x[1];
  _fn1(name, age, function () {
    if (--_counter === 0) _done();
  });
  var _fn2 = _x[2];
  _fn2(name, age, function () {
    if (--_counter === 0) _done();
  });
});
 */

// promise异步注册
queue.tapPromise("1", function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(1);
            resolve();
        }, 1000);
    });
});
queue.tapPromise("2", function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(2);
            resolve();
        }, 2000);
    });
});
queue.tapPromise("3", function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(3);
            resolve();
        }, 3000);
    });
});
queue.promise("zhufeng").then(() => {
    console.timeEnd("cost");
});
/**
(function anonymous(name, age) {
    var _x = this._x;
    return new Promise((function (_resolve, _reject) {
        var _counter = 3;
        var _done = (function () {
            _resolve();
        });
        var _fn0 = _x[0];
        var _promise0 = _fn0(name, age);
        _promise0.then((function () {
            if (--_counter === 0) _done();
        }));
        var _fn1 = _x[1];
        var _promise1 = _fn1(name, age);
        _promise1.then((function () {
            if (--_counter === 0) _done();
        }));
        var _fn2 = _x[2];
        var _promise2 = _fn2(name, age);
        _promise2.then((function () {
            if (--_counter === 0) _done();
        }));
    }));
})
 */