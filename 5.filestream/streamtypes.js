// 流的分类：1.可读流；2.可写流；3.双工流；4.转化流

const { Readable, Writable, Duplex, Transform } = require('stream');

class ReadStream extends Readable {
    _read() {
        // ...
    }
}

class WriteStream extends Writable {
    _write(chunk, encoding, cb) {
        // ...
    }
}

class DuplexStream extends Duplex {
    _read() {
        // ...
    }
    _write(chunk, encoding, cb) {
        // ...
    }
}

class TransformStream extends Transform {
    _transform(chunk, encoding, cb) { // 参数和可写流一样
        // ...
    }
}

// 转化流 -- 在对输入的过程进行一个转化操作，将输入的值，转化成大写的
class MyTransform extends Transform{
    _transform(chunk, encoding, cb){ // 参数和可写流一样
        chunk = chunk.toString().toUpperCase();
        this.push(chunk);
        cb();
    }
}
let transform = new MyTransform();

process.stdin.pipe(transform).pipe(process.stdout);

// process.stdin 标准输入
// process.stdout 标准输出
