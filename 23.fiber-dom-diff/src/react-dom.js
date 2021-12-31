import { createFiberRoot } from './ReactFiberRoot';
import { updateContainer } from './ReactFiberReconciler';

function render(element, container) {
    //创建一个fiberRoot，它指向根节点(div#root)容器
    let fiberRoot = container._reactRootContainer;
    if (!fiberRoot) {
        fiberRoot = container._reactRootContainer = createFiberRoot(container);
    }
    //把element这个虚拟dom变成真实dom插入容器中
    updateContainer(element, fiberRoot);
}
const ReactDOM = {
    render
}
export default ReactDOM;