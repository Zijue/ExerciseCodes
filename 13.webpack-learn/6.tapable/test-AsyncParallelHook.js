const { AsyncParallelHook } = require("./tapable");
let queue = new AsyncParallelHook(["name"]);
console.time("cost");
// 异步注册，全部任务完成后执行最终的回调
queue.tapAsync("1", function (name, callback) {
    setTimeout(function () {
        console.log(1);
        callback();
    }, 1000);
});
queue.tapAsync("2", function (name, callback) {
    setTimeout(function () {
        console.log(2);
        callback();
    }, 2000);
});
queue.tapAsync("3", function (name, callback) {
    setTimeout(function () {
        console.log(3);
        callback();
    }, 3000);
});
queue.callAsync("zhufeng", (err) => {
    console.log(err);
    console.timeEnd("cost");
});

// promise异步注册
// queue.tapPromise("1", function (name) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             console.log(1);
//             resolve();
//         }, 1000);
//     });
// });
// queue.tapPromise("2", function (name) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             console.log(2);
//             resolve();
//         }, 2000);
//     });
// });
// queue.tapPromise("3", function (name) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             console.log(3);
//             resolve();
//         }, 3000);
//     });
// });
// queue.promise("zhufeng").then(() => {
//     console.timeEnd("cost");
// });