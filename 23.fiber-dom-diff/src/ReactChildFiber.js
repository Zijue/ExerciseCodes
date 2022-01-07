import { createFiberFromElement } from './ReactFiber';
import { Placement } from './ReactFiberFlags';
import { REACT_ELEMENT_TYPE } from './ReactSymbols';

function childReconciler(shouldTrackSideEffects) {
    function placeSingleChild(newFiber) {
        debugger;
        //如果当前需要跟踪副作用，并且当前这个新的fiber它的替身不存在
        if (shouldTrackSideEffects && !newFiber.alternate) {
            //给这个新fiber添加一个副作用，表示在未来提交（commit）阶段的DOM操作中会向真实DOM树中添加此节点
            newFiber.flags = Placement;
        }
        return newFiber;
    }
    /**
     * 协调单节点
     * @param {*} returnFiber 新的父fiber
     * @param {*} currentFirstChild 老的第一个子fiber
     * @param {*} element 新的要渲染的虚拟DOM
     */
    function reconcileSingleElement(returnFiber, currentFirstChild, element) {
        //获取最新的虚拟DOM的key
        let key = element.key;
        //获取第一个老的fiber子节点
        let child = currentFirstChild;
        // while (child) {

        // }

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
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChild) {

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