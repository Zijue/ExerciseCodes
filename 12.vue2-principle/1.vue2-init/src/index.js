import { initMixin } from "./init";

function Vue(options) { // 构造函数，采用optionsApi
    this._init(options);
}
// 给Vue的构造函数扩展原型方法和静态方法
initMixin(Vue);
export default Vue;

// 当new Vue的时候都发生了什么，默认会进行vue的初始化操作，调用_init()，后面组件初始化也会调用_init
// optionsApi不知道这些选项哪些能用到，所以无法实现tree-shaking
