import { REACT_ELEMENT_TYPE, REACT_TEXT } from "./ReactSymbols";

//需要移除的属性
const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
}
//对虚拟dom进行包装，将字符串或者数字也变成一个对象
function wrapToVdom(element) {
    return typeof element === 'string' || typeof element === 'number'
        ? { $$typeof: REACT_ELEMENT_TYPE, type: REACT_TEXT, props: { content: element } } : element;
}
/**
 * 创建虚拟dom
 * @param {*} type 元素的类型
 * @param {*} config 配置对象
 * @param {*} children 第一个儿子，如果有多个儿子的话会依次放到后面
 */
function createElement(type, config, children) {
    const props = {};
    let key = null;
    let ref = null;
    if (config) {
        if (config.key) {
            key = config.key + ''; //保证key是字符串
        }
        if (config) {
            ref = config.ref;
        }
        for (let propName in config) { //移除特定的属性
            if (!RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }
    //根据传入的参数，处理儿子
    const childrenLength = arguments.length - 2;
    if (childrenLength === 1) { //只有一个儿子
        props.children = wrapToVdom(children);
    } else if (childrenLength > 1) { //有多个儿子
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
    }
    return {
        $$typeof: REACT_ELEMENT_TYPE, //表示类型是一个React元素
        type,
        ref,
        key,
        props
    }
}
const React = {
    createElement
}
export default React;
