import { compileToFunction } from "./compile/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options; // 后续所有的原型都可以通过vm.$options拿到用户传递的选项
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
}
