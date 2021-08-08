import { compileToFunction } from "./compile/index";
import { mountComponent } from "./lifecycle";
import Watcher from "./observer/watcher";
import { initState } from "./state";
import { mergeOptions } from "./utils";

export function callHook(vm, hook) { // 执行对应的钩子
    const handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm);
        }
    }
}
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        // vm.$options = options; // 后续所有的原型都可以通过vm.$options拿到用户传递的选项
        // 需要将Vue.mixin中传入的全局options和组件实例化传入的options合并
        vm.$options = mergeOptions(this.constructor.options, options); // 后续所有的原型中都可以通过vm.$options拿到用户传递的选项
        // 此处使用this.constructor.options而不使用Vue.options的原因：假如有的实例是通过继承Vue创建的，那么就拿不到继承的Vue上传入的options

        // 这里通过beforeCreate演示声明周期的调用
        callHook(vm, 'beforeCreate');

        initState(vm); // 状态的初始化，目的就是初始化用户传入的props、data、computed、watch

        // 判断用户是否传入了el，如果传入了el，要实现页面的挂载
        if (options.el) {
            vm.$mount(options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        // 模板编译：render -> template -> outerHTML
        el = document.querySelector(el);
        const vm = this;
        vm.$el = el; // 在实例上挂载el真实dom，方便后续挂载
        const options = vm.$options;
        if (!options.render) { // 没有render
            let template = options.template;
            if (!template) { // 如果没有模板，就采用指定元素对应的模板
                template = el.outerHTML;
            }
            options.render = compileToFunction(template); // 模板的编译
        }
        // 有render直接调用render方法
        // let render = options.render;
        // console.log(render);

        // 根据render方法产生虚拟节点，再将虚拟节点变成真实节点插入到页面中即可
        mountComponent(vm, el); // 组件的挂载流程
    }
    Vue.prototype.$watch = function (key, handler) {
        new Watcher(this, key, handler, { user: true });
    }
}
