import { currentInstance, setCurrentInstance } from "./component";

const enum LifeCycles {
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u'
}
function injectHook(lifecycle, hook, target) { // target指向的肯定是生命周期指向的实例
    // 后续执行时，可能是渲染儿子，此时currentInstance已经变成了儿子的实例，但是target的指向却永远是正确的（闭包记住的）
    if (!target) return; // 生命周期只能在setup函数中使用，如果target没有值说明使用位置不正确，直接返回或提示错误
    const hooks = target[lifecycle] || (target[lifecycle] = []); // 将生命周期保存在实例上，没有就创建
    const wrap = () => {
        setCurrentInstance(target); // 在执行生命周期前，用正确的实例替换回去，保证instance的正确性。也是为了保证用户在生命周期函数中调用getCurrentInstance时的正确性
        hook.call(target);
        setCurrentInstance(null);
    }
    hooks.push(wrap);
}
// vue3中所有生命周期函数（钩子）都在setup中使用，在执行setup前，将组件实例赋给了全局变量currentInstance，
// 然后通过函数闭包的方式，让钩子函数始终记住正确的组件实例。
// 如何理解？假设我们有父子组件 app --> xxx，那么子组件的钩子函数会先执行，那么当父组件的钩子函数执行时currentInstance已经变成了儿子的，
// 但是我们使用函数闭包，就可以在传入钩子时就将其与组件实例正确绑定。能做到这一点也是利用了JS单线程的特点。
function createHook(lifecycle) {
    return function (hook, target = currentInstance) { // 全局的当前实例
        injectHook(lifecycle, hook, target); // 利用函数的闭包特性
    }
}
export const onBeforeMount = createHook(LifeCycles.BEFORE_MOUNT);
export const onMounted = createHook(LifeCycles.MOUNTED);
export const onBeforeUpdate = createHook(LifeCycles.BEFORE_UPDATE);
export const onUpdated = createHook(LifeCycles.UPDATED);