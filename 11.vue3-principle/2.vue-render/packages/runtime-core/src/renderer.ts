import { createAppAPI } from "./apiCreateApp"

export function createRenderer(rendererOptions) { // 不再关心是什么平台，dom操作的方法由runtime-dom传入
    const render = (vnode, container) => {
        console.log('render: ', vnode, container);
    };
    return {
        createApp: createAppAPI(render),
        render
    }
}
