import { createFiberFromElement, createWorkInProgress } from './ReactFiber';
import { Deletion, Placement, Update } from './ReactFiberFlags';
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
    function updateElement(returnFiber, oldFiber, newChild) {
        if (oldFiber) {
            if (oldFiber.type === newChild.type) {
                //复用老fiber，同时将新的虚拟DOM的props更新到新fiber的pendingProps上
                const reusedFiber = useFiber(oldFiber, newChild.props);
                reusedFiber.return = returnFiber;
                return reusedFiber; //直接返回，不走后续创建流程
            }
        }
        //不能复用老fiber
        const created = createFiberFromElement(newChild);
        created.return = returnFiber;
        return created;
    }
    function updateSlot(returnFiber, oldFiber, newChild) {
        const key = oldFiber ? oldFiber.key : null;
        //如果新的虚拟DOM的key和老fiber的key一样
        if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild);
        } else { //如果key不一样，直接结束返回null
            return null;
        }
    }
    function placeChild(newFiber, lastPlacedIndex, newIdx) {
        newFiber.index = newIdx;
        if (!shouldTrackSideEffects) {
            return lastPlacedIndex;
        }
        const current = newFiber.alternate;
        //如果有current，说明是更新，复用老节点的更新，不会添加Placement
        if (current) {
            const oldIdx = current.index;
            //如果老fiber对应的真实DOM挂载的索引比lastPlacedIndex小
            if (oldIdx < lastPlacedIndex) {
                //老fiber对应的真实DOM就需要移动了
                newFiber.flags |= Placement;
                return lastPlacedIndex;
            } else {
                //否则，不需要移动，并且把老fiber它原来的挂载索引返回成为新的lastPlacedIndex
                return oldIdx;
            }
        } else {
            newFiber.flags = Placement;
            return lastPlacedIndex;
        }
    }
    function mapRemainingChildren(currentFirstChild) {
        const existingChildren = new Map();
        let existingChild = currentFirstChild;
        while (existingChild) {
            let key = existingChild.key || existingChild.index;
            existingChildren.set(key, existingChild);
            existingChild = existingChild.sibling;
        }
        return existingChildren;
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild) {
        const matchedFiber = existingChildren.get(newChild.key || newIdx);
        return updateElement(returnFiber, matchedFiber, newChild);
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
        //指的上一个可以复用的，不需要移动的节点的老索引
        let lastPlacedIndex = 0;

        //处理更新的情况，老fiber和新fiber都存在
        for (; oldFiber && newIdx < newChildren.length; newIdx++) {
            //先缓存下一个老fiber
            nextOldFiber = oldFiber.sibling;
            //试图复用此老fiber
            const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
            //如果key不一样，newFiber为null，直接跳出第一轮循环
            if (!newFiber) break;
            //老fiber存在，但是新的fiber并没有复用老fiber；key相同，type不同
            if (newFiber && !newFiber.alternate) {
                deleteChild(returnFiber, oldFiber); //删除老fiber
            }
            //核心：给当前的newFiber添加一个副作用flags，表示新增
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            if (!previousNewFiber) {
                resultingFirstChild = newFiber;
            } else {
                previousNewFiber.sibling = newFiber;
            }
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
        }

        //删除多余的老fiber
        if (newIdx === newChildren.length) {
            deleteRemainingChildren(returnFiber, oldFiber);
            return resultingFirstChild;
        }

        //如果没有老fiber，初次挂载
        if (!oldFiber) {
            //循环虚拟DOM数组，为每个虚拟DOM创建一个新的fiber
            for (; newIdx < newChildren.length; newIdx++) {
                const newFiber = createChild(returnFiber, newChildren[newIdx]);
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
            return resultingFirstChild;
        }

        //将剩下的老fiber放入map中
        const existingChildren = mapRemainingChildren(oldFiber);
        for (; newIdx < newChildren.length; newIdx++) {
            //去map中找找有没key相同并且类型相同可以复用的老fiber
            const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
            if (newFiber) {
                if (newFiber.alternate) { //说明复用的老fiber
                    existingChildren.delete(newFiber.key || newIdx);
                }
                //todo，还有问题
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
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