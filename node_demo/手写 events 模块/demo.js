// const EventEmitter = require('events'); // 系统 events 模块
const EventEmitter = require('./events'); // 自定义 events 模块，实现源码核心功能
const util = require('util');

// node 原型继承的几种方式
// Girl.prototype.__proto__ = EventEmitter.prototype;
// Girl.prototype = Object.create(EventEmitter.prototype); // ES5 提供的方法
// util.inherits(Girl, EventEmitter); // node 新版本提供
// util.inherits 实现原理是 Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype); // ES6 提供的方法

function XiaoChi() { }

util.inherits(XiaoChi, EventEmitter);

let xiaochi = new XiaoChi();
xiaochi.on('newListener', (eventName) => { // 每次绑定事件都会触发此函数(先出发 newListener 事件，再将绑定事件添加在回调数组中)
    // 只要绑定事件我就立即触发
    process.nextTick(() => { // 使用 process.nextTick() 异步方式实现事件绑定添加发生在触发之前（源码是 newListener 事件触发先于事件的绑定）
        xiaochi.emit(eventName, '偶尔逛逛 b 站');
    })
});
xiaochi.on('小池的日常', (...args) => {
    console.log('吃饭', ...args);
})
xiaochi.on('小池的日常', (...args) => {
    console.log('睡觉', ...args);
})
xiaochi.on('小池的日常', (...args) => {
    console.log('撸代码', ...args);
})
// playGame = (...args) => {
//     console.log('打游戏', ...args);
// }
// xiaochi.once('小池的日常', playGame)

// xiaochi.off('小池的日常', playGame);
// xiaochi.emit('小池的日常', '偶尔耍耍 b 站');
// xiaochi.emit('小池的日常', '偶尔耍耍 b 站');
