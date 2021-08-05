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
function initData(vm) {
    let data = vm.$options.data;
    console.log(data);
}
function initComputed(vm) {
    console.log('computed init')
}
function initWatch(vm) {
    console.log('watch init')
}
