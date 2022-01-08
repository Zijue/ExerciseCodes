import { updateProperties } from "./ReactDOMComponent";
import { appendChild, removeChild } from "./ReactDOMHostConfig";
import { HostComponent, HostRoot } from "./ReactWorkTags";

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
export function commitPlacement(effect) {
    let stateNode = effect.stateNode;
    let parentStateNode = getParentStateNode(effect);
    appendChild(parentStateNode, stateNode);
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
