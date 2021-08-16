import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;
class Watcher {
    constructor(vm, exprOrFn, callback, options = {}) {
        this.id = id++;
        if (typeof exprOrFn === 'function') { // 渲染调用watcher传入
            this.getter = exprOrFn; // 将用户传入的fn保存在getter上
        } else { // 用户传入vm.$watch
            this.getter = () => vm[exprOrFn]; // 取值的时候会收集watcher
        }
        this.depIds = new Set(); // 用于去重
        this.deps = []; // 存放watcher对应的dep
        this.vm = vm;
        this.lazy = options.lazy; // lazy为true则不要直接调用get方法
        this.dirty = this.lazy; // 计算属性默认dirty是true
        // this.value = this.get(); // this.value就是老的值；用于watchapi
        this.value = this.lazy ? undefined : this.get(); // 默认lazy就不要执行调用方法
        this.callback = callback;
        this.options = options; // 用户调用vm.$watch时会传入{user: true}
    }
    get() {
        // Dep.target = this; // 取值之前，将watcher挂在全局上，用于在vm._render()取值时，收集属性对应的watcher
        pushTarget(this);
        // let value = this.getter(); // 第一次渲染默认会调用getter（vm._update(vm._render())）取值操作
        let value = this.getter.call(this.vm); // 绑定vm执行，保证计算属性中的this指向正确
        // Dep.target = null;
        popTarget(); // [渲染watcher, 计算属性watcher] => [渲染watcher]
        return value;
    }
    update() {
        if (this.lazy) { // 计算属性不更新
            this.dirty = true; // 如果依赖的属性变化了，就让计算属性watcher的dirty在变为true，这样下次取值就能进入evaluate中的流程
        } else {
            // console.log('调用更新');
            queueWatcher(this);
        }
    }
    run() { // 真正的执行
        let oldValue = this.value;
        let newValue = this.get();
        if (this.options.user) { // 只有标识是用户watchapi传入，才执行回调函数
            this.callback(newValue, oldValue);
        }

        // console.log('执行更新');
        // this.get();
    }
    addDep(dep) {
        let depId = dep.id;
        if (!this.depIds.has(depId)) {
            this.depIds.add(depId);
            this.deps.push(dep); // 让watcher记住dep
            dep.addWatcher(this); // 同时让dep记住watcher
        }
    }
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    depend() {
        let l = this.deps.length; // name，age的Dep
        while (l--) { // [渲染watcher]
            this.deps[l].depend(); // 让属性记住渲染watcher
        }
    }
}
let watchsId = new Set();
let queue = [];
let pending = false;
function queueWatcher(watcher) {
    const id = watcher.id; // 取出watcher的id
    if (!watchsId.has(id)) {
        watchsId.add(id);
        queue.push(watcher); // watcher放到队列中
        if (!pending) {
            pending = true;
            // vue2 里面要考虑兼容性 vue2里面会优先采用promise但是ie不支持promise 需要降级成 mutationObserver h5提供的一个方法
            // setImmediate 这个方法在IE中性能是比较好的，都不兼容 setTimeout
            Promise.resolve().then(flushQueue);
        }
    }
}
function flushQueue() {
    for (let i = 0; i < queue.length; i++) {
        let watcher = queue[i];
        watcher.run();
    }
    queue.length = 0;
    watchsId.clear();
    pending = false;
}
export default Watcher;