import { createRenderer } from "@vue/runtime-core";
import { extend } from "@vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

// runtime-dom 主要的作用就是为了抹平平台的差异，不同平台对dom操作方式是不同的，
// 将api传入runtime-core，core中可以调用这些方法
const rendererOptions = extend(nodeOps, { patchProp });

/** 用户调用createApp方法，此时才会创建渲染器
 * 1.用户传入组件和属性
 * 2.需要创建组件的虚拟节点（diff算法）
 * 3.将虚拟节点变成真实节点
 */
export function createApp(rootComponent, rootProps = null) {
    let app = createRenderer(rendererOptions).createApp(rootComponent, rootProps);
    let { mount } = app;
    // 使用AOP切片的方式，重载mount方法，添加处理逻辑
    app.mount = function (container) {
        container = rendererOptions.querySelector(container);
        container.innerHTML = ''; // 在runtime-dom重写mount方法时，会对容器进行清空
        mount(container); // 执行runtime-core中的mount挂载方法
    }
    return app;
}
export * from '@vue/runtime-core';