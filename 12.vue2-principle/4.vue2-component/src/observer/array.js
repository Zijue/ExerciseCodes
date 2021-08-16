const oldArrayPrototype = Array.prototype;
export const proto = Object.create(oldArrayPrototype); // proto.__proto__ = oldArrayPrototype
// 函数劫持，让vue2中的数组，可以拿到重写后的原型，如果找不到就去调用数组本身的方法

const methods = ['push', 'pop', 'unshfit', 'shift', 'reverse', 'sort', 'splice'];
methods.forEach(method => {
    proto[method] = function (...args) { // args可能是对象，我们需要对新增的对象也增加劫持的操作
        // 调用老的方法
        // console.log('用户调用了', method);
        let r = oldArrayPrototype[method].call(this, ...args);
        // 需要对能新增元素的数组方法再次做拦截，将新增的属性进行代理
        let inserted;
        switch (method) {
            case 'push': // 往后新增
            case 'unshift': // 往前新增
                inserted = args;
                break;
            case 'splice': // arr.splice(0, 1, 新增的内容)
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        let ob = this.__ob__; // __ob__在observe中挂载到观测的data上

        ob.dep.notify(); // 触发收集的依赖，更新页面

        // 循环数组args对它的每一项都进行拦截
        if (inserted) ob.observeArray(args);
        return r;
    }
});