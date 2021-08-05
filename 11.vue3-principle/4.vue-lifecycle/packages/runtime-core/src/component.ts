import { isFunction, isObject } from "@vue/shared";
import { componentPublicInstance } from "./componentPublicInstance";

let uid = 0;
export function createComponentInstance(vnode) {
    const instance = {
        uid: uid++,
        vnode: vnode, // 实例上的vnode就是我们创建并处理过的vnode
        type: vnode.type, // 用户写的组件的内容
        props: {}, // props就是组件里用户声明过的
        attrs: {}, // 用户没用到的props就会放到attrs中
        slots: {}, // 组件都是插槽 ？在初始化组件时会将子组件传入（setupComponent），但是在创建虚拟节点时children为null，这里不是很明白
        setupState: {}, // setup的返回值
        proxy: null,
        emit: null, // 组件通信
        ctx: {}, // 上下文
        isMounted: false, // 组件是否挂载
        subTree: null, // 组件对应的渲染内容
        render: null
    }
    instance.ctx = { _: instance }; // 将自己放到了上下文中，并且在生产环境下不希望用户通过_访问到里边的变量
    return instance;
}
export function setupComponent(instance) {
    let { props, children } = instance.vnode;
    // 初始化属性和插槽；暂时简单处理，直接赋值，组件通信再详细写
    instance.props = props;
    instance.slots = children;
    // 在调用实例上的render方法时，可以调用proxy中的属性（按照setupState、ctx、props的顺序查找）
    instance.proxy = new Proxy(instance.ctx, componentPublicInstance);
    // 有setup的就是带状态的组件，目前我们只处理带状态的组件
    setupStatefulComponent(instance);
}
// 全局对象 currentInstance
export let currentInstance; // 用于在组件调用setup函数时，可以在函数执行过程中拿到当前组件的实例
function setupStatefulComponent(instance) {
    let component = instance.type;
    let { setup } = component;
    if (setup) { // 说明用户提供了setup方法
        let setupContext = createSetupContext(instance);
        currentInstance = instance; // 执行setup前，记录当前的实例
        // 用户调用setup方法可以拿到传入的属性及当前实例上下文
        let setupResult = setup(instance.props, setupContext);
        currentInstance = null; // setup执行后，清空当前的记录
        handleSetupResult(instance, setupResult);
    } else {
        finishComponentSetup(instance); // 如果用户没写setup，那么直接用外面的render
    }
}
function createSetupContext(instance) { // 根据当前实例获取一个上下文对象
    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
        expose: () => { } // 是为了表示组件暴露了哪些方法，用户可以通过ref调用哪些方法
    }
}
function handleSetupResult(instance, setupResult) {
    if (isObject(setupResult)) { // 用户传入的setup返回了一个对象，将值赋给实例的setupState属性
        instance.setupState = setupResult;
    } else if (isFunction) { // 用户传入的setup返回了一个函数，将值赋给实例的render属性
        instance.render = setupResult;
    }
    // 处理后实例上可能依旧没有render，那么就直接用外面的render
    // 处理后实例依旧没有render的情况：1.用户没写setup；2.用户写了setup但是没有返回值
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    let component = instance.type;
    if (!instance.render) {
        if (!component.render && component.template) {
            // 需要将template变成render函数，compileToFunctions()
        }
        instance.render = component.render;
    }
    // console.log(instance);
}
export const getCurrentInstance = () => {
    return currentInstance;
}
export const setCurrentInstance = (instance) => {
    currentInstance = instance;
}