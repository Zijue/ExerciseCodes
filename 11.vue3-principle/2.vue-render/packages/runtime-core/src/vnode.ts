import { isArray, isObject, isString, ShapeFlags } from "@vue/shared";

export function createVnode(type, props, children = null) {
    /** 虚拟节点？ 描述真实节点的对象。
     * 1.虚拟节点的好处就是可以跨平台；
     * 2.如果后续操作可以都在虚拟dom上进行操作，最后一起更新页面，在真实dom之前的一个缓存
     */
    const shapeFlag = isString(type) ? // h('h1', {}, 'xxx')
        ShapeFlags.ELEMENT : isObject(type) ?
            ShapeFlags.STATEFUL_COMPONENT : 0
    const vnode = {
        __v_isVnode: true,
        type, // 组件 || 标签：对于组件而言，组件的type就是一个对象
        props,
        children, // 组件的children是插槽
        key: props && props.key,
        el: null, // 对应一个真实的节点
        shapeFlag,
        component: null // 组件的实例
    }
    normalizeChildren(vnode, children); // 将子节点的类型统一记录在vnode中的shapeFlag中
    return vnode;
}
function normalizeChildren(vnode, children) {
    let type = 0;
    if (children == null) {

    } else if (isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN; // 数组
    } else {
        type = ShapeFlags.TEXT_CHILDREN;  // 文本
    }
    vnode.shapeFlag |= type
}