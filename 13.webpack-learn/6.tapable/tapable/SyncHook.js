const Hook = require("./Hook");
const HookCodeFactory = require('./HookCodeFactory');
// 创建函数的代码工具，用于动态创建函数
class SyncHookCodeFactory extends HookCodeFactory {
    content() {
        return this.callTapSeries(); // 以串行的方式调用tap函数
    }
}
const factory = new SyncHookCodeFactory(); // 通过工厂函数的方式创建不同的编译结果
class SyncHook extends Hook {
    compile(options) {
        factory.setup(this, options); // 先把Hook实例和配置对象传入
        return factory.create(options); // 创建一个新的函数（编译结果）并返回
    }
}
module.exports = SyncHook;