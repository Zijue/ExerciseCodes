const fs = require('fs');
const path = require('path');


// 打开一个可读流
let rs = fs.createReadStream(path.resolve(__dirname, 'sample.txt'));

rs.on('open', function (fd) {
    console.log(fd);
});

rs.on('data', function (chunk) {
    console.log('DATA: ', chunk)
});

rs.on('end', function () {
    console.log('END');
});

rs.on('error', function (err) {
    console.log('ERROR: ' + err);
});

rs.on('close', function () {
    console.log('close')
})

// <===================================================================>

// 打开一个可写流
let ws = fs.createWriteStream(path.resolve(__dirname, 'sample.txt'), {highWaterMark: 1});

ws.on('close', () => {
    console.log('close')
});

ws.write('紫珏', 'utf8', () => {
    console.log(1);
});
ws.write('紫珏', 'utf8', () => {
    console.log(2);
});
