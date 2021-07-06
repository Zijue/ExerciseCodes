const fs = require('fs').promises;

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let results = [];
        let index = 0;
        function process(v, k) { // 与after函数实现原理一致
            results[k] = v;
            if (++index == promises.length) { // 解决多个异步并发问题，只能靠计数器
                resolve(results);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            let p = promises[i];
            if (p && typeof p.then == 'function') {
                p.then(data => { // 异步的
                    process(data, i);
                }, reject);
            } else {
                process(p, i); // 同步的
            }
        }
    })
}

Promise.all([fs.readFile('./z1.txt', 'utf8'), fs.readFile('./z2.txt', 'utf8'), 123]).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
})
