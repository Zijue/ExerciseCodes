import { HostComponent, HostRoot } from './ReactWorkTags';
import { reconcileChildFibers, mountChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from './ReactDOMHostConfig';

/**
 * 创建当前fiber的子fiber
 * @param {*} current 
 * @param {*} workInProgress 
 */
export function beginWork(current, workInProgress) {
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress);
        case HostComponent:
            return updateHostComponent(current, workInProgress);
        default:
            break;
    }
}
/**
 * 更新或者说挂载根节点
 * ※ 依据虚拟DOM构建构建fiber树
 * @param {*} current 老fiber
 * @param {*} workInProgress 构建中的新fiber
 */
function updateHostRoot(current, workInProgress) {
    const updateQueue = workInProgress.updateQueue;
    //获取要渲染的虚拟DOM  <div key='title' id='title'>title</div>对应的虚拟DOM
    const nextChildren = updateQueue.shared.pending.payload.element; //这里指的就是最初updateContainer传入的element
    //处理子节点，根据老fiber和新的虚拟DOM进行对比，创建新的fiber树
    reconcileChildren(current, workInProgress, nextChildren);
    //返回第一个子fiber
    return workInProgress.child;
}
/**
 * 更新或者挂载原生组件
 * @param {*} current 
 * @param {*} workInProgress 
 */
function updateHostComponent(current, workInProgress) {
    //获取此原生组件的类型span p
    const type = workInProgress.type;
    //新属性
    const nextProps = workInProgress.pendingProps;
    let nextChildren = nextProps.children;
    //如果一个React原生组件，它只有一个子节点，并且这个儿子是一个字符串的话，react会进行优化处理
    //即不会对此子节点创建一个fiber节点，而是把它当成一个属性来处理
    let isDirectTextChild = shouldSetTextContent(type, nextProps);
    if (isDirectTextChild) {
        nextChildren = null;
    }
    //处理子节点，根据老fiber和新的虚拟DOM进行对比，创建新的fiber树
    reconcileChildren(current, workInProgress, nextChildren);
    //返回第一个子fiber
    return workInProgress.child;
}
export function reconcileChildren(current, workInProgress, nextChildren) {
    //如果current有值，说明这是一类似于更新的节点
    if (current) {
        //新老内容进行比较，得到差异进行更新
        workInProgress.child = reconcileChildFibers(
            workInProgress, //新的fiber
            current.child, //老fiber的第一个子fiber节点
            nextChildren //新的虚拟DOM
        )
    } else {
        //初次渲染，不需要比较
        workInProgress.child = mountChildFibers(
            workInProgress, //新的fiber
            null, //老fiber的第一个子fiber节点
            nextChildren //新的虚拟DOM
        )
    }
}
