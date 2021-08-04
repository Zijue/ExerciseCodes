import { createVnode } from "./vnode";

export function createAppAPI(render) {
    return (rootComponent, rootProps) => {
        const app = {
            _component: rootComponent, // 为了稍后组件挂载之前可以先校验组件是否有render函数或模板
            _props: rootProps,
            _container: null,
            mount(container) {
                app._container = container;
                // 1.根据用户传入的组件生成一个虚拟节点
                const vnode = createVnode(rootComponent, rootProps);
                // 2.将虚拟节点变成真实节点，插入到对应的容器中
                render(vnode, container);
            }
        };
        return app
    }
}