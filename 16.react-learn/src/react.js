import { REACT_CONTEXT, REACT_ELEMENT, REACT_FORWARD_REF, REACT_MEMO, REACT_PROVIDER } from './constants';
import { shallowEqual, wrapToVdom } from './utils';
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
/** 就是一个对象，Provider与Consumer循环引用context
let context  = {
    $$typeof: Symbol(react.context),
    Consumer: {$$typeof: Symbol(react.context), _context:context}
    Provider: {$$typeof: Symbol(react.provider), _context:context},
    _currentValue:{color:'red',changeColor}
}
context.Consumer._context=context;
context.Provider._context=context;
 */
function createContext() {
    let context = { $$typeof: REACT_CONTEXT, _currentValue: undefined }
    context.Provider = {
        $$typeof: REACT_PROVIDER,
        _context: context
    }
    context.Consumer = {
        $$typeof: REACT_CONTEXT,
        _context: context
    }
    return context;
}
function cloneElement(oldElement, props, children) {
    if (arguments.length > 3) { //说明有多个儿子
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
    } else if (arguments.length === 3) {
        props.children = wrapToVdom(children); //字符串、数字、React元素
    }
    return { ...oldElement, props }
}
class PureComponent extends Component {
    //https://github1s.com/facebook/react/blob/HEAD/packages/react-reconciler/src/ReactFiberClassComponent.new.js#L308-L314
    shouldComponentUpdate(nextProps, nextState) {
        //如果属性不相等或者状态不相等就返回true
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }
}
/** React.memo返回一个对象
{
    $$typeof: Symbol(react.memo)
    compare: null
    type: FunctionCounter 传入的函数组件
}
 */
function memo(type, compareFn = shallowEqual) {
    return {
        $$typeof: REACT_MEMO,
        compareFn, //用来比较新旧属性差异的函数
        type
    }
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    createContext,
    cloneElement,
    PureComponent,
    memo
}
export default React;