import { isArray, isObject, isVnode } from "@vue/shared";
import { createVnode } from "./vnode";

export function h(type, propsOrChildren, children) {
    // h方法第一个参数一定是类型，第二个参数可能是属性可能是儿子，后面的一定都是儿子，没有属性的情况，只能放数组
    // 还有一种情况是可以写文本，一个type + 一个文本
    const l = arguments.length;
    if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            if (isVnode(propsOrChildren)) { // h('div', h('p'))
                return createVnode(type, null, [propsOrChildren]);
            } else {
                return createVnode(type, propsOrChildren);
            }
        } else { // 是数组  h('h1', ['hello', 'hello'])
            return createVnode(type, null, propsOrChildren);
        }
    } else {
        if (l > 3) {
            children = Array.from(arguments).slice(2); // 获取第三个及之后的参数
        } else if (l === 3 && isVnode(children)) {
            // children也可能是个文本 或者 是个数组
            children = [children]; // h('div', {}, h('p'));
            // 文本在源码中不用变成数组，因为文本可以直接innerHTML，如果是元素，递归创建
        }
        return createVnode(type, propsOrChildren, children);
    }
}