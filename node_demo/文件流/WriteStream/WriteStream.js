const EventEmitter = require('events');
const fs = require('fs');

class WriteStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.flags = options.flags || 'w';
        this.encoding = options.encoding || 'utf8';
        // this.mode = options.mode || 0o666; // r w x  4 2 1 chmod -R 777
        this.emitClose = options.emitClose || true;
        this.start = options.start || 0;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        /* highWaterMark 字段解释
            期望使用多少字节完成写入操作：
                如果超出后 write 的返回值会变成 false
                    返回的 false 可以用于判断，告知用户不要再写入了，再写入只能放到内存中，占用内存
        */
        this.writing = false; // 默认不是正在写入，第一次调用 write 的时候需要执行 fs.write 方法
        this.length = 0; // 表示写入的个数，写入后需要进行减少
        this.needDrain = false; // 是否触发 drain 事件
        this.offset = this.start; // 写入的位置偏移量
        this.cache = [];

        this.open();
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
            if (err) this.destroy(err);
            this.fd = fd;
            this.emit('open', fd);
        })
    }
    clearBuffer() {
        // 清空缓存
        let data = this.cache.shift();
        if (data) {
            this._write(data.chunk, data.encoding, data.clearBuffer);
        } else {
            this.writing = false; // 后续的第一次操作继续向文件中写入
            if (this.needDrain) {
                this.needDrain = false;
                this.emit('drain')
            }
        }
    }
    write(chunk, encoding = this.encoding, cb = () => { }) {
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk); // 将 chunk 统一转成 buffer
        this.length += chunk.length;
        let result = this.length < this.highWaterMark; // 判断写入的长度与阀值的对比，false表示超出最大写入阀值，再调用write方法只能写入内存
        this.needDrain = !result; // 超过预期或者达到预期需要触发

        const clearBuffer = () => {
            this.clearBuffer();
            cb()
        }

        if (this.writing) {
            // 将写入的内容缓存起来
            this.cache.push({
                chunk,
                encoding,
                clearBuffer
            })
        } else {
            this.writing = true; // 正在写入
            this._write(chunk, encoding, clearBuffer);
        }
        return result;
    }
    _write(chunk, encoding, cb) {
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this._write(chunk, encoding, cb))
        }
        fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
            if (err) return this.destroy(err);
            this.offset += written; // 每次更新偏移量
            this.length -= written; // 减少缓存数量
            cb(); // 当前写入后，需要清空缓存
        })
    }
    end(chunk, encoding = this.encoding, cb = () => { }) {
        /**
         * end = write + close 此处仅为简单示意，存在bug，源码实现较为复杂有时间再梳理
         */
        this.write(chunk, encoding, ()=>{
            this.destroy();
            cb();
        })
    }
}

module.exports = WriteStream;