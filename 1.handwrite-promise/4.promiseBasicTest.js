const Promise = require('./promise');
const fs = require('fs');

// let promise = new Promise((resolve, reject) => {
//     resolve('ok1')
// });

// promise.then((value) => {
//     console.log('success', value);
//     // throw new Error('发生错误')
//     return value;
// }, (reason) => {
//     console.log('fail', reason);
//     return reason;
// }).then((value) => {
//     console.log('success2', value);
// }, (reason) => {
//     console.log('fail2', reason);
// })

// /** 代码执行结果
//  * ok2
//  * success ok1
//  */



// let p = new Promise((resolve, reject) => {
//     reject('ok')
// }).then().then().then((data) => {
//     console.log(data);
// }, err => {
//     console.log(err, 'err')
// });


// Promise.resolve().then(() => {
//     console.log(0);
//     return Promise.resolve(4); // promisA+规范里面如何规定的？
// }).then((res) => {
//     console.log(res)
// })
// Promise.resolve().then(() => {
//     console.log(1);
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(5);
// })

// 延迟对象解决嵌套问题
// function readFile(...args) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(...args, (err, data) => {
//             if (err) return reject(err);
//             resolve(data);
//         })
//     })
// }
// function readFile(...args) {
//     let dfd = Promise.deferred();
//     fs.readFile(...args, (err, data) => {
//         if (err) return dfd.reject(err);
//         dfd.resolve(data);
//     });
//     return dfd.promise
// }

// catch
// readFile('./111.txt', 'uft8').then(data => {
//     console.log('data');
// }).catch(err => {
//     console.log(err);
// }).then(data=>{
//     console.log('continue');
// })

// Promise.resolve(
//     new Promise((resolve, reject) => {
//         setTimeout(() => {
//             reject(555);
//         }, 1000);
//     })
// ).then(data => {
//     console.log(data);
// }, err => {
//     console.log('err: ' + err)
// })

Promise.reject(
    new Promise((resolve, reject) => {
        reject('ok')
    })
).then(data => {
    console.log(data);
}, err => {
    console.log(err)
})