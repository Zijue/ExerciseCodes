// promisify

// function promisify(fn) { // 高阶函数
//     return function (...args) {
//         return new Promise((resolve, reject) => {
//             fn(...args, function (err, data) { // node 所有的api第一个参数都是error
//                 if (err) return reject(err);
//                 resolve(data);
//             })
//         })
//     }
// }

// const fs = require('fs');

// let read = promisify(fs.readFile);
// read('z1.txt', 'utf8').then(data => {
//     console.log(data)
// });


// race 方法，调用的列表中任何一个成功或失败 就采用他的结果
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            if (promise && typeof promise.then == 'function') {
                promise.then(resolve, reject)
            } else {
                resolve(promise);
            }
        }
    })
}

// 图片懒加载 -> 请求超时的功能（显示错误信息）
// promise是没法中断执行的，无论如何都会执行完毕，只是不采用这个promise的成功或失败的结果了
// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('图片加载完成');
//     }, 3000);
// });
// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('请求超时');
//     }, 2000);
// })

// Promise.race([p1, p2]).then(data => {
//     console.log(data);
// }, err => {
//     console.log(err);
// })

// 为原有promise提供一个abort方法
// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('图片加载完成');
//     }, 3000);
// });
// function wrap(old) {
//     let abort;
//     let p2 = new Promise((resolve, reject) => {
//         abort = reject; // 内置了一个promise，我们可以控制这个promise，来影响promise.race的结果
//     })
//     let returnPromise = Promise.race([old, p2])
//     returnPromise.abort = abort;
//     return returnPromise
// }
// let newPromise = wrap(p1);

// setTimeout(() => {
//     newPromise.abort('超时 2000');
// }, 2000);
// newPromise.then(data => {
//     console.log(data);
// }, err => {
//     console.log(err)
// });


// 中断promise的链式调用
Promise.resolve('1').then(data => {
    console.log(data);
    return new Promise(() => { }); // 返回一个promise，会采用他的状态；如果不成功也不失败，就不会向下执行了
}).then((data) => {
    console.log(data)
});
