const ReadStream = require('./ReadStream');
const path = require('path');

let rs = new ReadStream(path.resolve(__dirname, 'readSample.txt'), {
    flags: 'r',
    encoding: null,
    autoClose: true,
    start: 0,
    highWaterMark: 3, // 每次读取3个字节
    // end: 5
});
// rs 是可读流对象
rs.on('open', function (fd) { // 内部会emit
    console.log(fd);
});
let arr = []
rs.on('data', function (chunk) { // 当用户监听data事件时内部会不停的将数据发射出来
    console.log(chunk);
    rs.pause(); // 暂停读取
    arr.push(chunk);
})
rs.on('end', function () {
    console.log(Buffer.concat(arr).toString())
})
rs.on('close', function () { // close 事件需要等待读取完毕后才会触发 fs.close
    console.log('close')
})
setInterval(()=>{
    rs.resume(); // 恢复读取
}, 1000)
