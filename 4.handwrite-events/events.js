function EventEmitter() {
    this._events = {}; // 实例属性
}

// {'绑定事件': [fn1, fn2, fn3]}
EventEmitter.prototype.on = function (eventName, callback) {
    if (!this._events) this._events = {}; // 原型继承不会继承实例属性；检查子类实例是否有 _events 属性，没有新建

    if (eventName !== 'newListener'){ // 源码中实现就是当绑定事件时，先触发 newListener 事件的回调再将绑定事件添加到对应的数组中
        this.emit('newListener', eventName);
    }

    if (!this._events[eventName]) {
        this._events[eventName] = [callback];
    } else {
        this._events[eventName].push(callback);
    }
}

EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this._events) this._events = {}; // 原型继承不会继承实例属性；检查子类实例是否有 _events 属性，没有新建
    if (this._events[eventName]) {
        this._events[eventName].forEach(fn => fn(...args));
    }
}

EventEmitter.prototype.off = function (eventName, callback) {
    if (!this._events) this._events = {}; // 原型继承不会继承实例属性；检查子类实例是否有 _events 属性，没有新建
    if (this._events[eventName]) {
        this._events[eventName] = this._events[eventName].filter(fn => fn !== callback && fn.listener !== callback); // 过滤掉要移除的回调函数
    }
}

EventEmitter.prototype.once = function (eventName, callback) {
    // 通过 AOP 编程的方式实现先执行 on 方法再执行 off 方法
    const _once = (...args) => {
        callback(...args);
        this.off(eventName, _once);
    }
    _once.listener = callback; // 在 _once 上添加一个监听属性指向 callback 函数
    this.on(eventName, _once);
}

module.exports = EventEmitter;
