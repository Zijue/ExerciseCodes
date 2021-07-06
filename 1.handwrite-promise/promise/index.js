const PENDING = 'PENDING'; // 默认等待态
const FULFILLED = 'FULFILLED'; // 成功态
const REJECTED = 'REJECTED'; // 失败态

function resolvePromise(x, promise2, resolve, reject) {
    if (x === promise2) { // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
        return reject(new TypeError('循环引用'));
    }
    if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
        let called = false; // 规范 2.3.3.3.3
        try {
            let then = x.then; // 尝试获取then方法
            if (typeof then === 'function') { // 可以认为x是一个promise了
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    resolvePromise(y, promise2, resolve, reject);
                }, (r) => {
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else { // 如果x是一个普通值，则直接调用resolve即可
        resolve(x);
    }
}

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (value instanceof Promise) { // 这个方法并不属于规范中的，只是为了和原生promise表现形式一样
                return value.then(resolve, reject);
            }
            if (this.status == PENDING) {
                this.value = value;
                this.status = FULFILLED;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };
        const reject = (reason) => {
            if (this.status == PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        try {
            executor(resolve, reject); // 默认 new Promise 中的函数会立即执行
        } catch (e) { // 传入的函数执行出错，将错误传递给 reject，执行失败态的逻辑
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected == 'function' ? onRejected : e => { throw e };
        let promise2 = new Promise((resolve, reject) => {
            if (this.status == FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(x, promise2, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            }
            if (this.status == REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            }
            if (this.status == PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(x, promise2, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
            }
        });
        return promise2;
    }
    catch(errFn) {
        return this.then(null, errFn);
    }
    static resolve(value) {
        return new Promise((resolve, reject) => {
            resolve(value);
        })
    }
    static reject(err) {
        return new Promise((resolve, reject) => {
            reject(err);
        })
    }
}

Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}

module.exports = Promise;


