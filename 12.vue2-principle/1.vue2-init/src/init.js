import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options; // 后续所有的原型都可以通过vm.$options拿到用户传递的选项
        initState(vm); // 状态的初始化，目的就是初始化用户传入的props、data、computed、watch
    }
}