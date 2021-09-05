let { AsyncSeriesHook } = require("tapable");
let queue = new AsyncSeriesHook(["name"]);
console.time("cost");
// queue.tapAsync("1", function (name, callback) {
//     setTimeout(function () {
//         console.log(1);
//         // callback(); // 必须要执行callback才会继续执行下一个注册的事件
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

// promise的方式注册事件
queue.tapPromise("1", function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(1, name);
            resolve();
        }, 1000);
    });
});
queue.tapPromise("2", function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(2, name);
            resolve();
        }, 2000);
    });
});
queue.tapPromise("3", function (name) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(3, name);
            resolve();
        }, 3000);
    });
});
queue.promise("zhufeng").then((data) => {
    console.log(data);
    console.timeEnd("cost");
});