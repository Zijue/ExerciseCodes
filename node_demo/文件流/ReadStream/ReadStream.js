const EventEmitter = require('events');
const fs = require('fs');

class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.flags = options.flags || 'r';
        this.encoding = options.encoding || null;
        this.autoClose = options.autoClose || true;
        this.start = options.start || 0;
        this.end = options.end || undefined;
        this.highWaterMark = options.highWaterMark || 64 * 1024; // 每次读取的字节
        this.offset = 0;
        this.flowing = false; // 默认不是流动模式
        /* 
            1.对默认值进行操作
            2.打开文件
            3.当绑定data事件时调用_read方法
        */
        this.open(); // fs.open 异步api，没发直接拿到fd
        this.on('newListener', (type) => {
            if (type === 'data') {
                this.flowing = true;
                this._read(); // 真正读取的方法
            }
        })
    }
    destroy(err) {
        if (err) this.emit('error', err);
        if (typeof this.fd === 'number') {
            fs.close(this.fd, () => {
                this.emit('close');
            })
        }
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) return this.destroy(err);
            this.fd = fd;
            this.emit('open', fd);

            // 源码中是打开后立即进行读取操作
        })
    }
    _read() { // 此方法中调用 fs.read
        if (typeof this.fd !== 'number') { // 由于fs.open方法是异步的，所以当调用_read方法时文件可能还没有打开
            return this.once('open', () => this._read()); // 绑定open事件，当文件打开时通知执行_read方法
        }
        let buf = Buffer.alloc(this.highWaterMark); // 每次读取的个数
        /* howMuchToRead
                        假设读取 1234567890 且 highWaterMark = 3
        没有传递 end      123 456 789 0
        传递 end = 4     123 45     备注：不知道为什么end设计为全闭区间
        */
        let howMuchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.offset + 1) : this.highWaterMark;
        // 调用真实的read
        fs.read(this.fd, buf, 0, howMuchToRead, this.offset, (err, byteRead) => { // byteRead 真实读到的字节数
            if (err) return this.destroy(err);
            if (byteRead > 0) {
                this.emit('data', buf.slice(0, byteRead));
                this.offset += byteRead;
                if (this.flowing) this._read(); // 如果是流动模式才继续下一轮的读取
            } else {
                this.emit('end');
                this.destroy(); // 读取完毕后出发文件操作符关闭操作
            }
        });
    }
    pause() {
        this.flowing = false;
    }
    resume() {
        if (!this.flowing) { // 如果不是流动模式则恢复读取
            this.flowing = true;
            this._read(); // 继续读取
        }
    }
}

module.exports = ReadStream;
