import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp"

export function createRenderer(rendererOptions) { // 不再关心是什么平台，dom操作的方法由runtime-dom传入
    const mountComponent = (n2, container) => {

    };
    const updateComponent = (n1, n2, container) => {

    }
    const processElement = (n1, n2, container) => {

    };
    const processComponent = (n1, n2, container) => {
        if (n1 == null) {
            mountComponent(n2, container); // 创建并挂载组件
        } else {
            updateComponent(n1, n2, container); // 更新组件
        }
    };
    const patch = (n1, n2, container) => {
        const { shapeFlag } = n2; // n2 可能是元素或者组件，不同的类型走不同的处理逻辑
        if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(n1, n2, container); // 处理元素类型
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(n1, n2, container); // 处理组件类型
        }
    };
    const render = (vnode, container) => {
        // console.log('render: ', vnode, container);
        patch(null, vnode, container); // 初始化逻辑，老的虚拟节点为null；后续更新还有更新逻辑
    };
    return {
        createApp: createAppAPI(render),
        render
    }
}
