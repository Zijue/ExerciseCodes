const Hook = require("./Hook");
const HookCodeFactory = require('./HookCodeFactory');
// 创建函数的代码工具，用于动态创建函数
class AsyncParallelHookCodeFactory extends HookCodeFactory {
    content({ onDone }) {
        return this.callTapParallel({ onDone }); // 以并行的方式调用tap函数
    }
}
const factory = new AsyncParallelHookCodeFactory(); // 通过工厂函数的方式创建不同的编译结果
class AsyncParallelHook extends Hook {
    compile(options) {
        factory.setup(this, options); // 先把Hook实例和配置对象传入
        return factory.create(options); // 创建一个新的函数（编译结果）并返回
    }
}
module.exports = AsyncParallelHook;