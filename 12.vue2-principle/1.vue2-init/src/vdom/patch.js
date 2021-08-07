export function patch(oldVnode, vnode) {
    if (oldVnode.nodeType === 1) { // 如果是真实的DOM元素，会有一个nodeType属性且等于1
        console.log('初始化渲染');
    }
}