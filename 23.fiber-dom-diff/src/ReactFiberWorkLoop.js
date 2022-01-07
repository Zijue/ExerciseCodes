import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { Deletion, Placement, PlacementAndUpdate, Update } from "./ReactFiberFlags";
import { commitPlacement } from "./ReactFiberCommitWork";

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
    workLoopSync();
    //提交，修改DOM
    commitRoot();
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
    //在beginWork后，需要把新属性同步到老属性上
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    if (next) {
        workInProgress = next;
    } else {
        // console.log(workInProgress)
        //如果当前fiber没有子fiber，那么当前的fiber就算完成
        completeUnitOfWork(unitOfWork);
    }
}
/**
 * 完成一个fiber节点
 * @param {*} unitOfWork 
 */
function completeUnitOfWork(unitOfWork) {
    let completedWork = unitOfWork;
    do {
        const current = completedWork.alternate;
        const returnFiber = completedWork.return;
        //完成此fiber对应的真实DOM节点的创建和属性赋值
        completeWork(current, completedWork);
        //收集当前fiber的副作用到父fiber上
        collectEffectList(returnFiber, completedWork);
        //当自己这个fiber完成后，寻找下一个要构建的fiber
        const siblingFiber = completedWork.sibling;
        if (siblingFiber) {
            //如果有弟弟，就开始构建弟弟，处理弟弟的beginWork
            workInProgress = siblingFiber;
            return;
        }

        //这个循环到最后的时候，returnFiber就是null，也就是根fiber的父亲
        completedWork = returnFiber;
        //最后workInProgress=null就可以退出workLoop了
        workInProgress = completedWork;
    } while (workInProgress);
}
function collectEffectList(returnFiber, completedWork) {
    if (returnFiber) {
        //如果父fiber没有effectList，那就让父fiber的firstEffect链表头指向自己的头
        if (!returnFiber.firstEffect) {
            returnFiber.firstEffect = completedWork.firstEffect;
        }
        //如果自己有链表尾
        if (completedWork.lastEffect) {
            //并且父fiber也有链表尾
            if (returnFiber.lastEffect) {
                //把自己身上的effectList链接到父fiber的链表尾
                returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
            }
            returnFiber.lastEffect = completedWork.lastEffect;
        }

        const flags = completedWork.flags;
        //如果此完成的fiber有副作用，那么就需要添加到effectList中
        if (flags) {
            //如果父fiber有lastEffect的话，说明父fiber已经有effect链表
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = completedWork;
            } else {
                returnFiber.firstEffect = completedWork;
            }
            returnFiber.lastEffect = completedWork;
        }
    }
}
function commitRoot() {
    const finishedWork = workInProgressRoot.current.alternate; //指向新构建的fiber树
    workInProgressRoot.finishedWork = finishedWork;
    commitMutationEffects(workInProgressRoot);
}
/**
 * 提交fiber树的副作用，修改DOM
 * @param {*} root fiberRoot
 */
function commitMutationEffects(root) {
    const finishedWork = root.finishedWork;
    let nextEffect = finishedWork.firstEffect;
    let effectList = '';
    while (nextEffect) {
        effectList += `(${getFlags(nextEffect.flags)}#${nextEffect.type}#${nextEffect.key})`
        const flags = nextEffect.flags;
        switch (flags) {
            case Placement:
                commitPlacement(nextEffect);
                break;
            default:
                break;
        }
        nextEffect = nextEffect.nextEffect;
    }
    effectList += 'null';
    console.log(effectList);
    root.current = finishedWork;
}
function getFlags(flags) {
    switch (flags) {
        case Placement:
            return '插入';
        case Update:
            return '更新';
        case Deletion:
            return '删除';
        case PlacementAndUpdate:
            return '移动';
        default:
            break;
    }
}