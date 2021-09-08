const QUEUED_STATE = 0; // 已经入队，待执行
const PROCESSING_STATE = 1; // 处理中
const DONE_STATE = 2; // 处理完成

class ArrayQueue {
    constructor() {
        this._list = [];
    }
    enqueue(item) {
        this._list.push(item);
    }
    dequeue() {
        return this._list.shift(); // 移除并返回数组中的第一个元素
    }
}
class AsyncQueueEntry {
    constructor(item, callback) {
        this.item = item; // 任务的描述，存放着key之类的
        this.state = QUEUED_STATE; // 这个条目的当前状态
        this.callbacks = [callback]; // 任务完成的回调
    }
}
class AsyncQueue {
    constructor({ name, parallelism, processor, getKey }) {
        this._name = name; // 队列的名字
        this._parallelism = parallelism; // 并发执行的任务数
        this._processor = processor; // 针对队列中的每个条目执行什么操作
        this._getKey = getKey; // 函数，返回一个key用来唯一标识每个元素
        this._entries = new Map();
        this._queued = new ArrayQueue(); // 存放将要执行的任务数组队列
        this._activeTasks = 0; // 当前正在执行的数
        this._willEnsureProcessing = false; // 是否将要开始处理
    }
    // 向队列中添加任务，然后判断一下如果能执行就立即执行，如果不能执行就放入队列
    add(item, callback) {
        const key = this._getKey(item); // 获取这个条目对应的key
        const entry = this._entries.get(key); // 获取这个key对应的老的条目
        if (entry !== undefined) {
            if (entry.state === DONE_STATE) {
                process.nextTick(() => callback(entry.error, entry.result));
            } else if (entry.callbacks === undefined) {
                entry.callbacks = [callback]
            } else {
                entry.callbacks.push(callback);
            }
            return;
        }
        const newEntry = new AsyncQueueEntry(item, callback); // 创建一个新的条目
        this._entries.set(key, newEntry); // 放到_entries中
        this._queued.enqueue(newEntry); // 把这个新条目放到队列
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing);
        }
    }
    _ensureProcessing = () => {
        // 如果当前的激活的或者说正在执行任务数小于并发数
        while (this._activeTasks < this._parallelism) {
            const entry = this._queued.dequeue(); // 先进先出
            if (entry === undefined) break;
            this._activeTasks++; // 先让正在执行的任务数+1
            entry.state = PROCESSING_STATE; // 条目状态置为执行中
            this._startProcessing(entry);
        }
        this._willEnsureProcessing = false;
    }
    _startProcessing(entry) {
        this._processor(entry.item, (e, r) => {
            this._handleResult(entry, e, r);
        })
    }
    _handleResult = (entry, error, result) => {
        const callbacks = entry.callbacks;
        entry.state = DONE_STATE; // 把条目的状态设置为已经完成
        entry.callbacks = undefined;
        entry.result = result; // 把结果赋给entry
        entry.error = error; // 把错误对象赋给entry
        if (callbacks !== undefined) {
            for (const callback of callbacks) {
                callback(error, result);
            }
        }
        this._activeTasks--;
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing);
        }
    }
}
module.exports = AsyncQueue;