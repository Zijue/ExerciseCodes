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
export default Dep;