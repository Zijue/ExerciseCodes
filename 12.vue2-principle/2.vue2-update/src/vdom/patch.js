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
    }
}
function createEle(vnode) {
    const { tag, props, children, text } = vnode;
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        children.forEach(child => {
            vnode.el.appendChild(createEle(child));
        })
        // 样式diff算法时候处理
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}