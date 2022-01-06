import { HostComponent } from "./ReactWorkTags";
import { createInstance, appendChild, finalizeInitialChildren } from "./ReactDOMHostConfig";

export function completeWork(current, workInProgress) {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case HostComponent:
            //在新的fiber构建完成的时候，收集更新并且标识：更新副作用
            if (current && workInProgress.stateNode) {
                updateHostComponent(current, workInProgress, workInProgress.tag, newProps);
            } else {
                //创建真实的DOM节点
                const type = workInProgress.type;
                //创建此fiber的真实DOM节点
                const instance = createInstance(type);
                //让此fiber的真实DOM属性指向instance
                workInProgress.stateNode = instance;
                //给真实DOM添加属性，包括如果独生子节点是文本的情况，也在这里处理
                finalizeInitialChildren(instance, type, newProps);
            }
            break;
        default:
            break;
    }
}
function appendAllChildren(parent, workInProgress) {
    let node = workInProgress.child;
    while (node) {
        if (node.tag === HostComponent) {
            appendChild(parent, node.stateNode);
        }
        node = node.sibling;
    }
}
/**
 * 更新原生组件
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} tag 
 * @param {*} newProps 新虚拟DOM上的新属性
 */
function updateHostComponent(current, workInProgress, tag, newProps) {

}