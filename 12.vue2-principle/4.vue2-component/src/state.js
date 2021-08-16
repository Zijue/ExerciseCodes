import Dep from "./observer/dep";
import { observe } from "./observer/index";
import Watcher from "./observer/watcher";

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
function defineComputed(target, key, fn) { // vm, firstname, 用户的函数
    Object.defineProperty(target, key, {
        get() {
            const watcher = target._computedWatchers[key]; // 当用户取值时，会拿到缓存的watcher
            // 计算属性watcher上有一个dirty属性
            if (watcher && watcher.dirty) {
                watcher.evaluate(); // 求值操作，求值后将dirty变为false
            }
            // 我们需要让计算属性依赖的name/age收集上一层的依赖，使页面刷新
            // Dep.target = 渲染watcher  [name, age]
            // console.log(watcher.deps); // [Dep, Dep]
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    })
}
function initComputed(vm) {
    const computed = vm.$options.computed;
    // 每一个计算属性都是一个watcher
    const watchers = vm._computedWatchers = {}; // 存储计算属性的所有watcher存到实例上
    for (let key in computed) {
        let userDef = computed[key];
        watchers[key] = new Watcher(vm, userDef, () => { }, { lazy: true });
        // 将计算属性与watcher关联之后，还需要将计算属性代理到vm实例上，便于通过vm.firstname取值
        defineComputed(vm, key, userDef); // Object.defineProperty
    }
    // console.log(watchers);
}
function initWatch(vm) {
    // console.log('watch init')
    const watch = vm.$options.watch;
    // 给每一个属性都创建一个watcher
    for (let key in watch) {
        createWatcher(vm, key, watch[key]);
    }
}
// watcher可以分为：渲染watcher、用户watcher、计算属性watcher
function createWatcher(vm, key, callback) {
    return vm.$watch(key, callback); // 监控某个属性和对应的处理函数
}