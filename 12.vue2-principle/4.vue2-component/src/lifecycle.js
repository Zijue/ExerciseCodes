import { callHook } from "./init";
import Watcher from "./observer/watcher";
import { createElement, createTextElement } from "./vdom/index";
import { patch } from "./vdom/patch";

export function mountComponent(vm, el) {
    // console.log(vm.$options.render, el);

    // vue3里面靠的是产生一个effect，vue2中靠的是watcher
    let updateComponent = () => {
        // 1.产生虚拟节点   2.根据虚拟节点产生真实节点
        vm._update(vm._render());
    }
    // updateComponent();
    new Watcher(vm, updateComponent, () => {
        callHook('beforeUpdate');
    }); // 渲染是通过watcher来进行渲染的

    callHook(vm, 'mounted');
}
export function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) { // 虚拟dom变成真实dom进行渲染的，后续更新也调用此方法
        // console.log(vnode);
        // 每次一更新，就会调用_update()此方法
        const vm = this;
        // vue2通过查看是否有_vnode属性，判断是第一次挂载还是更新；vue3则是通过isMounted判断
        let preVnode = vm._vnode; // 上一次的虚拟节点
        vm._vnode = vnode;
        if (!preVnode) {
            this.$el = patch(this.$el, vnode); // 初次渲染，传入一个真实的dom和vnode。新的节点需要返回挂载到$el上，用于下一次更新
        } else { // 更新，传入两个虚拟节点vnode，diff算法
            this.$el = patch(preVnode, vnode);
        }
    }
    Vue.prototype._c = function () { // _c('div',undefoined,[])
        return createElement(this, ...arguments)
    }
    Vue.prototype._v = function (text) { // _v(字符串 + name + 'xxx')
        return createTextElement(this, text)
    }
    Vue.prototype._s = function (val) { // _s(name)
        if (typeof val === 'object') return JSON.stringify(val);
        return val;
    }
    Vue.prototype._render = function () { // 调用编译后的render方法，生成虚拟节点
        const vm = this;
        let { render } = vm.$options;
        let vnode = render.call(vm); // 这里会进行取值操作，触发属性的get方法（依赖收集）
        return vnode;
    }
}