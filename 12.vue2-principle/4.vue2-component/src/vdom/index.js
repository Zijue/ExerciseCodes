// 组件的渲染流程大致可以分为以下几步：
// 1.先声明组件的映射关系
// 2.根据组件的名字生成一个组件的虚拟节点
// 3.创造组件的实例
// 4.替换原来渲染的内容
const isResrved = (tag) => { // 判断是不是原生元素标签，如果不是就是组件<my-button>
    return ['a', 'div', 'p', 'span', 'ul', 'li', 'button', 'input'].includes(tag);
}
function createComponentVnode(vm, tag, props, children, Ctor) {
    if (typeof Ctor == 'object') { // 如果是对象，就需要使用Vue.extend来包裹
        Ctor = vm.constructor.extend(Ctor);
    }
    props.hook = {
        init(vnode) { // 专门用于组件的初始化，组件的虚拟节点上还有一个componentOptions属性
            // 实际调用new Sub()._init({})产生一个组件的实例，然后会走实例的初始化Vue.prototype._init
            let child = vnode.componentInstance = new vnode.componentOptions.Ctor({}); // 实际调用new Sub()._init({})
            // 因为组件的options.el是空的，所以需要手动调用$mount完成组件的挂载
            // 内部会产生一个真实节点，挂载到了child.$el/vnode.componenetInstance.$el上
            child.$mount(); // 会将组件挂载后的结果放到$el属性上
        }
    }
    return vnode('vm', `vue-component-${tag}`, props, undefined, undefined, props.key, { Ctor, children })
}
export function createElement(vm, tag, props = {}, children) {
    // 通过tag判断是元素还是组件
    if (isResrved(tag)) {
        return vnode(vm, tag, props, children, undefined, props.key)
    } else {
        // 根据当前组件来生成一个虚拟节点，组件的虚拟节点
        // 通过组件名找到对应的组件定义
        /*
        "my-botton":
            "template": "<button>内部按钮 {{b}}</button>"
        [[Prototype]]:
            "my-botton":
                f vueComponent(opts)
        */
        // 此时Ctor可能是vueComponent函数，也可能是对象；如果是对象，我们需要调用Vue.extend
        const Ctor = vm.$options['components'][tag]; // Vue.extend({template, data}) => Sub
        return createComponentVnode(vm, tag, props, children, Ctor)
    }
}
export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, text)
}
function vnode(vm, tag, props, children, text, key, componentOptions) {
    return {
        vm,
        tag,
        props,
        children,
        text,
        key,
        componentOptions
    }
}