import { isSameVnode } from "../utils";

export function patch(oldVnode, vnode) {
    if (oldVnode.nodeType === 1) { // 如果是真实的DOM元素，会有一个nodeType属性且等于1
        // console.log('初始化渲染', vnode);
        // vue2中的流程是：1.先根据虚拟节点创造真实节点；2.将节点插入到页面中，再将老节点删除。
        // 为什么vue2中不能$mount('body')、$mount('html')？ 因为会删除挂载的老节点
        const parentElement = oldVnode.parentNode; // 现获取父元素
        const element = createEle(vnode); // 创建新的节点
        parentElement.insertBefore(element, oldVnode.nextSibling); // 插入到老节点的下一个元素之前
        parentElement.removeChild(oldVnode); // 删除老节点
        return element;
    } else {
        // diff 算法（diff算法是同级比较，从第一层开始，一层一层的比较）
        patchVnode(oldVnode, vnode);
        return vnode.el; // 返回更新后的真实dom
    }
}
export function createEle(vnode) {
    const { tag, props, children, text } = vnode;
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        updateProperties(vnode); // 将节点的属性赋给真实dom
        children.forEach(child => {
            vnode.el.appendChild(createEle(child));
        })
        // 样式diff算法时候处理
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}
function patchVnode(oldVnode, vnode) {
    // 首先查看一下节点是否可以复用，如果不能，直接删除老的，重新创建新节点插入
    if (!isSameVnode(oldVnode, vnode)) { // 不能复用，新的替换老的
        return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
    }
    // 如果新老节点可以复用，那么就复用老的真实节点
    let el = vnode.el = oldVnode.el; // 节点复用

    // 如果是相同节点，还需要判断是否为文本，文本只需要用新的文本替换老的文本
    // 如何判断是否是文本？查看虚拟接地那的tag属性，有tag属性就是元素，没有就是文本
    if (!oldVnode.tag) { // 文本
        if (oldVnode.text !== vnode.text) { // 直接更新文本
            return oldVnode.el.textContent = vnode.text;
        }
    }
    // 逻辑走到此处，表示新老节点都是元素，且标签相同；更新老节点的属性
    updateProperties(vnode, oldVnode.props);
    // 比对完第一层的标签后，接下来就是比对彼此的子节点了；有三种情况：1.双方都有儿子；2.一方有儿子，一方没有节点；3.双方儿子都是文本
    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];
    if (oldChildren.length > 0 && newChildren.length > 0) { // 双方都有儿子
        updateChildren(el, oldChildren, newChildren);
    } else if (oldChildren.length > 0) { // 老的有儿子，新的没有儿子
        el.innerHTML = '';
    } else if (newChildren.length > 0) { // 新的有儿子，老的没有儿子
        newChildren.forEach(child => el.appendChild(createEle(child)));
    }
}
function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.props || {};
    let el = vnode.el;
    /** 比较前后属性是否一致，老的有新的没有，将老的删除掉
     * 如果新的有，老的也有，以新的为准
     * 如果新的有，老的没有，直接替换成新的
     */
    let oldStyle = oldProps.style || {};
    let newStyle = newProps.style || {};
    for (let key in oldStyle) {
        if (!(key in newStyle)) { // 老的有的样式，新的没有，直接移除
            el.style[key] = '';
        }
    }
    for (let key in oldProps) {
        if (!(key in newProps)) { // 老的有的属性，新的没有，直接移除
            el.removeAttribute(key);
        }
    }
    for (let key in newProps) { // 以新的为准
        if (key == 'style') {
            for (let styleName in newStyle) {
                el.style[styleName] = newStyle[styleName];
            }
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}
function updateChildren(el, oldChildren, newChildren) { // 比较儿子节点，vue2中diff算法的实现
    let oldStartIndex = 0;
    let newStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let newEndIndex = newChildren.length - 1;

    let oldStartVnode = oldChildren[oldStartIndex];
    let newStartVnode = newChildren[newStartIndex];
    let oldEndVnode = oldChildren[oldEndIndex];
    let newEndVnode = newChildren[newEndIndex];

    function makeIndexByKey(oldChildren) {
        let map = {};
        oldChildren.forEach((item, index) => {
            map[item.key] = index;
        });
        return map;
    }
    const map = makeIndexByKey(oldChildren); // 将老节点的key与下标索引做映射

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) { // 不停循环至一方遍历结束为止
        if (!oldStartVnode) { // 防止指针在移动的时候oldChildren中的那一项已经被移动走了，则直接跳过
            oldStartVnode = oldChildren[++oldStartIndex];
        } else if (!oldEndVnode) {
            oldEndIndex = oldChildren[--oldEndIndex];
        } else if (isSameVnode(oldStartVnode, newStartVnode)) { // 从头开始对比，比对成功后指针向后移
            patchVnode(oldStartVnode, newStartVnode); // 标签一样就继续比对属性，属性比对完就比对儿子
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 从尾部开始比对，比对成功后指针向前移
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 头尾比对，比对成功后，将头部节点移动到正确位置并移动指针
            patchVnode(oldStartVnode, newEndVnode);
            // insertBefore是具备移动性的，移动走了，原来的就不存在了
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 尾头比对
            patchVnode(oldEndVnode, newStartVnode);
            el.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else { // 在做完上述四种情况的优化后，之后剩下的就是乱序比对
            // 乱序比对，需要造一个映射表，去搜索看是否存在，如果存在就复用
            // 拿新节点中的第一个key去老的映射表里查找
            let moveIndex = map[newStartVnode.key]; // 能找到说明需要移动并且复用
            if (moveIndex == undefined) { // 没找到说明是新增的
                el.insertBefore(createEle(newStartVnode), oldStartVnode.el);
            } else { // 比较并且移动节点
                let moveVnode = oldChildren[moveIndex]; // 获取要移动的节点
                patchVnode(moveVnode, newStartVnode); // 如果能复用就要去比对
                el.insertBefore(moveVnode.el, oldStartVnode.el); // 将当前节点移动出来
                oldChildren[moveIndex] = null; // 清空移动节点索引位置的值，不能直接删除，会导致数组塌陷
            }
            newStartVnode = newChildren[++newStartIndex]; // 新节点下标后移
        }
    }
    if (oldStartIndex <= oldEndIndex) { // 老的比新的多，移除新的中不需要的元素
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i];
            if (child !== null) {
                el.removeChild(child.el);
            }
        }
    }
    if (newStartIndex <= newEndIndex) { // 新的比老的多，插入新的元素
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            // 找尾指针的下一个人，如果有就是插入，没有就是追加
            let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
            el.insertBefore(createEle(newChildren[i]), anchor);
        }
    }
}