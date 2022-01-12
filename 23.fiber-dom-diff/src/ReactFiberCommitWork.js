import { updateProperties } from "./ReactDOMComponent";
import { appendChild, insertBefore, removeChild } from "./ReactDOMHostConfig";
import { HostComponent, HostRoot } from "./ReactWorkTags";
import { Placement } from "./ReactFiberFlags";

function getParentStateNode(fiber) {
    let parent = fiber.return;
    do {
        if (parent.tag === HostComponent) {
            return parent.stateNode;
        } else if (parent.tag === HostRoot) {
            return parent.stateNode.containerInfo;
        } else {
            //函数组件或类组件
            parent = parent.return;
        }
    } while (parent);
}
function getHostSibling(fiber) {
    let node = fiber.sibling;
    while (node) {
        //找它的弟弟们，找到最近一个，不是插入的节点，返回
        if (!(node.flags & Placement)) {
            return node.stateNode;
        }
        node = node.sibling;
    }
    return null;
}
/**
 * 插入节点
 * @param {*} effect 需要插入的fiber
 */
export function commitPlacement(effect) {
    let stateNode = effect.stateNode;
    let parentStateNode = getParentStateNode(effect);
    let before = getHostSibling(effect);
    if (before) {
        insertBefore(parentStateNode, stateNode, before);
    } else {
        appendChild(parentStateNode, stateNode);
    }
}
export function commitDeletion(fiber) {
    if (!fiber) return;
    let parentStateNode = getParentStateNode(fiber);
    removeChild(parentStateNode, fiber.stateNode);
}
/**
 * 提交DOM更新操作
 * @param {*} current 
 * @param {*} finishedWork 
 */
export function commitWork(current, finishedWork) {
    const updatePayload = finishedWork.updateQueue;
    finishedWork.updateQueue = null;
    if (updatePayload) {
        updateProperties(finishedWork.stateNode, updatePayload);
    }
}
