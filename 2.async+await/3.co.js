let fs = require('fs').promises;

function* read() { // 更像同步
    const a = yield fs.readFile('a1.txt', 'utf8');
    const b = yield fs.readFile(a, 'utf8');
    return b;
}

// let it = read();
// let { value, done } = it.next();
// value.then(data => {
//     let { value, done } = it.next(data);
//     value.then(data => {
//         let { value, done } = it.next(data);
//         console.log(value); // 紫珏
//     })
// });

// const co = require('co');
// co(read()).then(data => {
//     console.log(data); // 紫珏
// })

function co(it) {
    return new Promise((resolve, reject) => {
        function next(data) {
            let { value, done } = it.next(data);
            if (done) {
                return resolve(value);
            }
            Promise.resolve(value).then(data => {
                next(data);
            }, reject)
        }
        next();
    })
}

co(read()).then(data => {
    console.log(data); // 紫珏
}, err => {
    console.log(err);
})
