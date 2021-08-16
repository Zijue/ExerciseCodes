let id = 0;
class Dep {
    constructor() {
        this.id = id++;
        this.watchers = [];
    }
    depend() {
        // this.watchers.push(Dep.target);
        Dep.target.addDep(this);
    }
    notify() {
        this.watchers.forEach(watcher => watcher.update());
    }
    addWatcher(watcher) {
        this.watchers.push(watcher);
    }
}
Dep.target = null; // 用于全局挂载对应的watcher
const stack = []; // 用栈记住不同层级的watcher [渲染watcher, 计算属性watcher]
export function pushTarget(watcher) {
    stack.push(watcher); // Dep.target = wathcer
    Dep.target = watcher;
}
export function popTarget() {
    stack.pop(); // Dep.target = null;
    Dep.target = stack[stack.length - 1];
}
export default Dep;