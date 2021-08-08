import { observe } from "./observer/index";

export function initState(vm) {
    const options = vm.$options;
    // 先props 再methods 再data 再computed 再watch  (检测重名 规则是vue自己定的)
    if (options.data) {
        initData(vm); // 初始化data选项
    }
    if (options.computed) {
        initComputed(vm); // 初始化计算属性
    }
    if (options.watch) {
        initWatch(vm); // 初始化watch
    }
}
function proxy(target, key, property) {
    Object.defineProperty(target, property, {
        get() {
            return target[key][property];
        },
        set(value) {
            target[key][property] = value;
        }
    })
}
function initData(vm) {
    let data = vm.$options.data; // data可能是函数或者对象
    // 需要对用户提供data属性，把它的所有属性进行重写增添get和set；只能拦截已经存在的属性
    data = vm._data = typeof data == 'function' ? data.call(vm) : data; // vm._data和data是同一个对象，用户可以通过vm._data拿到观测过对象
    // 用户使用vm._data来获取有些麻烦，可以通过代理的方式实现vm.xxx -> vm._data.xxx取值
    for (let key in data) {
        proxy(vm, '_data', key); // 循环代理属性，为了用户使用的时候，直接可以通过vm.xxx取值
    }
    observe(data); // 对数据进行观测
}
function initComputed(vm) {
    console.log('computed init')
}
function initWatch(vm) {
    console.log('watch init')
}
