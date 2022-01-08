import { HostComponent } from "./ReactWorkTags";
import { createInstance, appendChild, finalizeInitialChildren, prepareUpdate } from "./ReactDOMHostConfig";
import { Update } from "./ReactFiberFlags";

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
    //老fiber上的老属性
    let oldProps = current.memoizedProps;
    //可复用真实的DOM节点
    const instance = workInProgress.stateNode;
    const updatePayload = prepareUpdate(instance, tag, oldProps, newProps);
    workInProgress.updateQueue = updatePayload;
    if (updatePayload) {
        //如果flags原来是0，变成100
        workInProgress.flags |= Update;
        //为什么会有上面这一步，举个例子：
        //当flags=6时，就是既要插入新位置，又要更新，针对的就是DOM-DIFF中节点移动的情况
    }
}
/**
 * 根fiber rootFiber updateQueue 是一个环状链表 update {payload: element}
 * 原生组件 HostComponent updateQueue 是一个数组 updatePayload [key1, value1, key2, value2]
 */