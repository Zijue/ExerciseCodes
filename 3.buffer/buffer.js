// buffer 代表的是内存，不能随便调整大小
// 需要对内存进行拼接处理，先声明一个更大的Buffer，将多个buffer拷贝上去
let buf1 = Buffer.from('小池');
let buf2 = Buffer.from('同学');
let buf3 = Buffer.alloc(12);
buf1.copy(buf3, 0, 0, 6); // 四个参数：数据拷贝的目标，目标起始位置，源起始位置，源结束位置  默认后两位参数不写拷贝全部数据
buf2.copy(buf3, 6, 0, 6);
console.log(buf3.toString()); // 小池同学
// copy 原理
Buffer.prototype.copy = function(targetBuffer, targetStart, sourceStart = 0, sourceEnd = this.length){
    for (let index = sourceStart; index < sourceEnd; index++) {
        targetBuffer[targetStart++] = this[index]; // 将自身buffer中的值拷贝到目标Buffer上
    }
}

// buffer.slice
// buffer类似与数组，有索引、长度，但buffer里存的是内存地址（引用类型）
let buf4 = Buffer.from([1, 2, 3]);
let buf5 = buf4.slice(0,1); // 在内存地址上截出来某一段位置
console.log(buf4); // <Buffer 01 02 03>
console.log(buf5); // <Buffer 01>
buf5[0] = 100;
console.log(buf4); // <Buffer 64 02 03>

// Buffer.concat 方法 -- 拼接Buffer
// Buffer.concat 原理
Buffer.concat = function(bufferList, length){
    if (typeof length == 'undefined') {
        length = 0;
        bufferList.forEach(buffer => {
            length += buffer.length;
        })
    }
    let newBuffer = Buffer.alloc(length);
    let offset = 0;
    bufferList.forEach(buffer => {
        buffer.copy(newBuffer, offset);
        offset += buffer.length;
    });
    return newBuffer;
}
// Buffer.concat 验证
let concatBuffer = Buffer.concat([buf1, buf2]);
console.log(concatBuffer.toString());

// Buffer.isBuffer
console.log(Buffer.isBuffer(buf3)); // true
console.log(Buffer.isBuffer(123)); // false

// buffer.indexOf
console.log(buf3.indexOf('池')); // 3 下标索引，单位为字节

// 自定义buffer.split方法（node.js无此方法）
Buffer.prototype.split = function(sep){
    let arr = [];
    let offset = 0; // 偏移位置
    let current = 0; // 当前找到的索引
    let len = Buffer.from(sep).length; // 分隔符真实的长度，单位字节
    while(-1!=(current = this.indexOf(sep, offset))){ // 查找到位置（字节）的索引，只要有继续
        arr.push(this.slice(offset, current));
        offset = current + len;
    }
    arr.push(this.slice(offset));
    return arr;
}
let buf6 = Buffer.from('小池同学');
let res = buf6.split('池'); //
console.log(res); // [ <Buffer e5 b0 8f>, <Buffer e5 90 8c e5 ad a6> ]
res[0][1] = 100;
console.log(res); // [ <Buffer e5 64 8f>, <Buffer e5 90 8c e5 ad a6> ]