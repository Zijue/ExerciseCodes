import { compileToFunction } from "./compile/index";
import { initMixin } from "./init";
import { initGlobalAPI } from "./initGlobalAPI/index";
import { lifeCycleMixin } from "./lifecycle";
import { createEle, patch } from "./vdom/patch";

function Vue(options) { // 构造函数，采用optionsApi
    this._init(options);
}
// 给Vue的构造函数扩展原型方法和静态方法
initGlobalAPI(Vue);
initMixin(Vue);
lifeCycleMixin(Vue);
export default Vue;

// 当new Vue的时候都发生了什么，默认会进行vue的初始化操作，调用_init()，后面组件初始化也会调用_init
// optionsApi不知道这些选项哪些能用到，所以无法实现tree-shaking

// <------------------------------------------------------>
// 手动挂载的方式，验证diff算法
// const template1 = `<ul>
// <li style="background: red;" key="A">A</li>
// <li style="background: green;" key="B">B</li>
// <li style="background: blue;" key="C">C</li>
// <li style="background: purple;" key="D">D</li>
// </ul>`
// 手动将模板渲染成render函数
// const render1 = compileToFunction(template1);
// const vm1 = new Vue({ data() { } });
// const oldVnode = render1.call(vm1); // 生成虚拟节点
// const el1 = createEle(oldVnode); // 产生了一个真实的节点
// document.getElementById('app').appendChild(el1);

// const template2 = `<ul>
// <li style="background: purple;" key="B">B</li>
// <li style="background: blue;" key="C">C</li>
// <li style="background: green;" key="D">D</li>
// <li style="background: red;" key="A">A</li>
// </ul>`
// 此处是模拟。但是必须要理解清楚，更新不会再次生成AST，只会生成一次，产生一个render函数，render函数根据不同的数据渲染内容（即render函数返回的前后虚拟节点，所以我们需要做一个diff算法）
// const render2 = compileToFunction(template2);
// const newVnode = render2.call(vm1);

// setTimeout(() => {
//     patch(oldVnode, newVnode); // 后续更新逻辑，不再产生真实节点
// }, 1000);