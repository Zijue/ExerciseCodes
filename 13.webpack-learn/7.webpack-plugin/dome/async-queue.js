// webpack5有一非常重要的更新，为了提高性能，全部变成异步队列
// let AsyncQueue = require('webpack/lib/util/AsyncQueue'); // 在源码里，此队列用来编译模块
let AsyncQueue = require('./AsyncQueue');
function processor(item, callback) {
    setTimeout(() => {
        console.log('process', item);
        callback(null, item);
    }, 3000);
}
//每个条目 的唯一标识
function getKey(item) {
    return item.key;
}
let queue = new AsyncQueue({
    name: 'createModule',
    parallelism: 3, //并发数3
    processor, //处理器，每个任务要干啥
    getKey
});

const start = Date.now();
let task1 = { key: 'module1' };
queue.add(task1, (err, result) => {
    console.log(err, result);
    console.log(Date.now() - start);
});
let task2 = { key: 'module2' };
queue.add(task2, (err, result) => {
    console.log(err, result);
    console.log(Date.now() - start);
});
let task3 = { key: 'module3' };
queue.add(task3, (err, result) => {
    console.log(err, result);
    console.log(Date.now() - start);
});
let task4 = { key: 'module4' };
queue.add(task4, (err, result) => {
    console.log(err, result);
    console.log(Date.now() - start);
});