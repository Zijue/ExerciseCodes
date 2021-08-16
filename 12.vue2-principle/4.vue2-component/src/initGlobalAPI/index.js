import { mergeOptions } from "../utils";

export function initGlobalAPI(Vue) {
    Vue.options = {}; // 所有的全局属性，都会放到这个变量上
    Vue.mixin = function (options) {
        // 此处的this指代的是Vue本身
        this.options = mergeOptions(this.options, options);
    }
    Vue.options.components = {}; // 存放全局组件
    // Vue.component：1.定义全局组件映射关系到Vue.options.components中；2.内部调用Vue.extend返回一个子类
    Vue.component = function (id, componentDef) {
        // id：组件名；componentDef：组件定义
        componentDef.name = componentDef.name || id;
        componentDef = this.extend(componentDef); // 此处this指的是父类
        this.options.components[id] = componentDef;
    }
    // extend是组件的核心方法
    // 1.定义全局组件映射关系到Vue.options；2.内部调用Vue.extend返回一个子类
    Vue.extend = function (options) {
        const Super = this;
        const Sub = function vueComponent(opts) {
            this._init(opts); // 组件的初始化
        }
        // 子类继承父类原型方法
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        // 合并的时候需要构造一个父子关系
        Sub.options = mergeOptions(Super.options, options); // 合并父类与子类的options属性
        return Sub;
    }
}