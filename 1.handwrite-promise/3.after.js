const fs = require('fs');

function after(times, callback) {
    let data = {}
    return function finish(key, value) { // 函数声明所在的作用域和执行的作用域不是同一个此时就会产生闭包
        data[key] = value;
        if (Reflect.ownKeys(data).length == times) {
            callback(data);
        }
    }
}
let finish = after(2, (school) => { // 调用两次finish之后，调用cb
    console.log(school);
})
fs.readFile('./name.txt', 'utf8', function (err, data) {
    finish('name', data)
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
    finish('age', data)
});
