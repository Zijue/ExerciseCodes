import { createFiberFromElement, createWorkInProgress } from './ReactFiber';
import { Deletion, Placement } from './ReactFiberFlags';
import { REACT_ELEMENT_TYPE } from './ReactSymbols';

function childReconciler(shouldTrackSideEffects) {
    /**
     * 老的子fiber在新的虚拟DOM树中不存在，则标记为删除
     * @param {*} returnFiber 
     * @param {*} childToDelete 
     */
    function deleteChild(returnFiber, childToDelete) {
        //如果不需要跟踪副作用，直接返回
        if (!shouldTrackSideEffects) return;
        //把自己这个副作用添加到父亲的副作用链表（effectList）中
        //删除类型的副作用一般放在父fiber副作用链表的后面，在进行DOM操作时先执行删除操作
        const lastEffect = returnFiber.lastEffect;
        if (lastEffect) {
            lastEffect.nextEffect = childToDelete;
            returnFiber.lastEffect = childToDelete;
        } else { //父fiber节点effectList是空的
            returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
        }
        //清空下一个副作用的指向
        childToDelete.nextEffect = null;
        //标记为删除
        childToDelete.flags = Deletion;
    }
    function deleteRemainingChildren(returnFiber, childToDelete) {
        while (childToDelete) {
            deleteChild(returnFiber, childToDelete);
            childToDelete = childToDelete.sibling;
        }
    }
    function useFiber(oldFiber, pendingProps) {
        let clone = createWorkInProgress(oldFiber, pendingProps);
        clone.index = 0; //此fiber挂载的索引清空
        clone.sibling = null; //清空弟弟
        return clone;
    }
    function placeSingleChild(newFiber) {
        //如果当前需要跟踪副作用，并且当前这个新的fiber它的替身不存在
        if (shouldTrackSideEffects && !newFiber.alternate) {
            //给这个新fiber添加一个副作用，表示在未来提交（commit）阶段的DOM操作中会向真实DOM树中添加此节点
            newFiber.flags = Placement;
        }
        return newFiber;
    }
    function createChild(returnFiber, newChild) {
        const created = createFiberFromElement(newChild);
        created.return = returnFiber;
        return created;
    }
    /**
     * 协调单节点
     * @param {*} returnFiber 新的父fiber
     * @param {*} currentFirstChild 老的第一个子fiber
     * @param {*} element 新的要渲染的虚拟DOM
     */
    function reconcileSingleElement(returnFiber, currentFirstChild, element) {
        //获取第一个老的fiber子节点
        let child = currentFirstChild;
        while (child) { //这是为了处理新的虚拟DOM是单节点，而老的虚拟DOM是多节点的情况
            //老fiber的key和新的虚拟DOM的key相同说明
            if (child.key === element.key) {
                //判断老的fiber的type和新的虚拟DOM的type是否相同
                if (child.type === element.type) {
                    //说明新老节点相同，准备复用老fiber，删除剩下的其它fiber
                    deleteRemainingChildren(returnFiber, child.sibling);
                    //复用老fiber，同时将新的虚拟DOM的props更新到新fiber的pendingProps上
                    const reusedFiber = useFiber(child, element.props);
                    reusedFiber.return = returnFiber;
                    return reusedFiber; //直接返回，不走后续创建流程
                } else {
                    //key相同，type不同，则删除包括当前老fiber在内所有后续的老fiber
                    deleteRemainingChildren(returnFiber, child);
                    break; //跳出循环，走新fiber创建流程
                }
            } else {
                // 如果不相同，说明当前这个老fiber不是对应于新的虚拟DOM节点，把此老fiber标记为删除，并且继续弟弟
                deleteChild(returnFiber, child);
            }
            //继续匹配弟弟
            child = child.sibling;
        }

        //初次渲染，根据虚拟节点创建fiber，并将fiber.return指向父fiber
        const created = createFiberFromElement(element);
        created.return = returnFiber;
        return created;
    }
    /**
     * 协调多个节点；有多个子节点
     * @param {*} returnFiber 
     * @param {*} currentFirstChild 
     * @param {*} newChild 
     */
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
        //将要返回的第一个新fiber
        let resultingFirstChild = null;
        //上一个新fiber
        let previousNewFiber = null;
        //当前的老fiber
        let oldFiber = currentFirstChild;
        //下一个老fiber
        let nextOldFiber = null;
        //新的虚拟DOM的索引
        let newIdx = 0;
        //如果没有老fiber，初次挂载
        if (!oldFiber) {
            //循环虚拟DOM数组，为每个虚拟DOM创建一个新的fiber
            for (; newIdx < newChildren.length; newIdx++) {
                const newFiber = createChild(returnFiber, newChildren[newIdx]);
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
            return resultingFirstChild;
        }
    }
    /**
     * @param {*} returnFiber 新的父fibber
     * @param {*} currentFirstChild 老的第一个子fiber；current表示老的父fiber
     * @param {*} newChild 新的虚拟DOM
     */
    function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
        //判断newChild是不是一个对象，如果是的话说明新的虚拟DOM只有一个React元素节点
        const isObject = typeof newChild === 'object' && (newChild);
        if (isObject) {
            //说明新的虚拟DOM是单节点
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(reconcileSingleElement(
                        returnFiber, currentFirstChild, newChild
                    ));
                default:
                    break;
            }
        }
        if (Array.isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
        }
    }
    return reconcileChildFibers;
}
export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);