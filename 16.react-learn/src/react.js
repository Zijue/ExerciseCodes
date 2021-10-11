import { REACT_ELEMENT, REACT_FORWARD_REF } from './constants';
import { wrapToVdom } from './utils';
import { Component } from './component';

function createElement(type, props, children) {
    let ref, key;
    props = Object.assign({}, props);
    if (props) {
        ref = props.ref; //用来引用真实DOM元素
        key = props.key; //用来进行DIFF优化的，唯一标识某个子元素
        delete props.ref;
        delete props.key;
        delete props.__self;
        delete props.__source;
    }
    if (arguments.length > 3) { //如果参数的长度大于3，说明有多个子节点
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
    } else if (arguments.length === 3) {
        props.children = wrapToVdom(children); //children可以是字符串、数字、React元素
    }
    /*
    {
        "type": "h1",
        "key": null,
        "ref": null,
        "props": {
            "className": "title",
            "style": {
            "color": "red"
            },
            "children": "hello"
        },
        "_owner": null,
        "_store": {}
    }
     */
    return {
        $$typeof: REACT_ELEMENT, //指的是元素的类型
        type, //dom标签的类型 h1 h2 span div
        ref,
        key,
        props //元素的属性，如className style children
    }
}
function createRef() {
    return { current: null }
}
/**
 * 
 * @param {*} render 就是指的需要转发ref的函数组件
 */
function forwardRef(render) {
    return {
        $$typeof: REACT_FORWARD_REF,
        render
    }
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef
}
export default React;