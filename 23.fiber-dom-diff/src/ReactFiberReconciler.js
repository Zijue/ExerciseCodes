import { createUpdate, enqueueUpdate } from './ReactUpdateQueue';

/**
 * 把虚拟dom元素变成真实dom渲染到container容器中
 * @param {*} element 
 * @param {*} container 
 */
export function updateContainer(element, container) {
    //获取hostRootFiber
    const current = container.current; //正常来说一个fiber节点对应一个真实dom节点，hostRootFiber对应的dom节点就是 div#root
    //就是创建一个空对象
    const update = createUpdate();
    update.payload = { element };
    //把更新添加到fiber的更新队列中
    enqueueUpdate(current, update);
}