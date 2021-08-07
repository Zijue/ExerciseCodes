import { proto } from "./array";

export function observe(data) {
    // data 就是用户传入的数据，需要对它进行观测
    if (typeof data !== 'object' || data == null) {
        return; // 不是对象不能观测
    }
    // 后续我们要知道这个对象是否被观测过了
    return new Observer(data); // xxx instanceof Observer
}

class Observer {
    constructor(value) { // 将用户传入的数据循环进行重写
        // value.__ob__ = this; // 给监控的data增加一个__ob__属性，方便后续数组操作时拿到observeArray方法
        // 直接给value挂载__ob__属性，会走到walk遍历属性，然后__ob__进行观测，然后又走到此处，给观测对象再次挂载__ob__属性，死循环了
        Object.defineProperty(value, '__ob__', {
            enumerable: false, // 在后续的循环中不可枚举的属性不能被遍历处理
            value: this
        })
        if (Array.isArray(value)) {
            value.__proto__ = proto; // 重写数组的七个方法
            this.observeArray(value); // 如果数组里面放的是对象，要对对象再次代理
        } else {
            this.walk(value);
        }
    }
    walk(target) {
        Object.keys(target).forEach(key => {
            defineReactive(target, key, target[key]);
        })
    }
    observeArray(target) {
        for (let i = 0; i < target.length; i++) {
            observe(target[i]);
        }
    }
}
function defineReactive(target, key, value) { // 定义响应式
    observe(value); // 递归对象类型检测（性能差，默认情况下要对所有的都进行递归操作）
    // 不存在的属性不会被defineProperty
    Object.defineProperty(target, key, { // 将属性重新定义在对象上，增加了get和set（性能差）
        get() {
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue); // 设置的值如果是对象，那么就再次调用observe让对象变成响应式的
            value = newValue;
        }
    })
}