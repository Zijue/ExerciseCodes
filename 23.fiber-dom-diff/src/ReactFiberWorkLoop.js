import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

//当前正在更新的根
let workInProgressRoot = null;
//当前正在更新的fiber节点
let workInProgress = null;
/**
 * 不管如何更新，不管谁来更新，都会调度到这个方法里
 * @param {*} fiber 
 */
export function scheduleUpdateOnFiber(fiber) {
    //找到当前fiber树对应的fiberRoot。fiberRoot与rootFiber不一样，fiberRoot.current指向rootFiber，rootFiber.stateNode指向fiberRoot
    const fiberRoot = markUpdateLaneFromFiberToRoot(fiber); //就是div#root
    performSyncWorkOnRoot(fiberRoot);
}
function markUpdateLaneFromFiberToRoot(sourceFiber) {
    let node = sourceFiber;
    let parent = node.return;
    while (parent) {
        node = parent;
        parent = parent.return;
    }
    //走到这一步，node就肯定是fiber树的根节点，其实就是hostRootFiber，.stateNode就是div#root
    return node.stateNode;
}
/**
 * 根据老的fiber树和更新对象，创建新的fiber树，然后根据新的fiber树更新真实dom
 * @param {*} fiberRoot 
 */
function performSyncWorkOnRoot(fiberRoot) {
    workInProgressRoot = fiberRoot;
    workInProgress = createWorkInProgress(workInProgressRoot.current);
    //执行工作循环，构建副作用链
    debugger;
    workLoopSync();
}
/**
 * 开始自上而下构建新的fiber树
 */
function workLoopSync() {
    while (workInProgress) {
        performUnitOfWork(workInProgress);
    }
}
/**
 * 执行单个工作单元
 * @param {*} unitOfWork 要处理的fiber
 */
function performUnitOfWork(unitOfWork) {
    //获取当前正在构建的fiber的替身
    const current = unitOfWork.alternate;
    //开始构建当前fiber的子fiber链表；它会返回下一个要处理的fiber，一般都是unitOfWork的大儿子
    let next = beginWork(current, unitOfWork);
    console.log(next);
}