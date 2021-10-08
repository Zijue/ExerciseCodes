import { REACT_FORWARD_REF, REACT_TEXT } from "./constants";
import { addEvent } from "./event";

/**
 * 将虚拟dom渲染挂载到指定的真实dom容器上
 * @param {*} vdom 虚拟dom，即React元素
 * @param {*} container 真实dom容器
 */
function render(vdom, container) {
    mount(vdom, container); //挂载方法
}
function mount(vdom, container) {
    //把虚拟DOM变成真实DOM
    let newDOM = createDOM(vdom);
    //把真实DOM追加到容器上
    container.appendChild(newDOM);
}
/**
 * 把虚拟dom变成真实dom
 * @param {*} vdom 虚拟dom
 * @returns 真实dom
 */
function createDOM(vdom) {
    let { type, props, ref } = vdom;
    let dom; //真实dom
    if (type && type.$$typeof === REACT_FORWARD_REF) {
        return mountForwardComponent(vdom); //挂载ref转发组件
    } else if (type === REACT_TEXT) { //创建文本节点
        dom = document.createTextNode(props.content);
    } else if (typeof type === 'function') { //函数组件/类组件（类最后都会编译成函数）
        if (type.isReactComponent) { //类组件
            return mountClassComponent(vdom);
        } else { //函数组件
            return mountFunctionComponent(vdom);
        }
    } else { //创建dom节点：span、h1、div、p等
        dom = document.createElement(type);
    }
    if (props) {
        //更新dom的属性
        updateProps(dom, {}, props);
        let children = props.children;
        //如果儿子是一个对象，且有type属性，说明是React元素，需要挂载
        if (typeof children === 'object' && children.type) {
            mount(children, dom);
        } else if (Array.isArray(children)) {
            reconcilChildren(children, dom);
        }
    }
    vdom.dom = dom; //在虚拟dom挂载或者说放置一个dom属性指向此虚拟dom对应的真实dom
    if (ref) ref.current = dom;
    return dom;
}
function mountForwardComponent(vdom) {
    let { type, props, ref } = vdom;
    let renderVdom = type.render(props, ref);
    return createDOM(renderVdom);
}
function mountFunctionComponent(vdom) { //挂载函数组件
    let { type: functionComponent, props } = vdom;
    let renderVdom = functionComponent(props); //执行函数组件的函数，获取需要渲染的虚拟dom返回值
    vdom.oldRenderVdom = renderVdom; //记录老的渲染虚拟dom，供后续diff用
    return createDOM(renderVdom);
}
function mountClassComponent(vdom) { //挂载类组件
    let { type: ClassComponent, props, ref } = vdom;
    let classInstance = new ClassComponent(props); //创建类组件的实例
    if (ref) ref.current = classInstance; //类组件的ref指向类组件的实例
    let renderVdom = classInstance.render(); //调动实例的render方法
    classInstance.oldRenderVdom = renderVdom; //将类组件实例与老的虚拟DOM关联
    return createDOM(renderVdom);
}
function reconcilChildren(children, parentDOM) {
    children.forEach(childVdom => mount(childVdom, parentDOM));
}
function updateProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') { //此处不处理子节点
            continue;
        } else if (key === 'style') {
            let styleObj = newProps[key];
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr];
            }
        } else if (/^on[A-Z].*/.test(key)) { //说明是一个事件处理函数
            //DOM.onclick = 事件处理函数;
            // dom[key.toLowerCase()] = newProps[key];
            addEvent(dom, key.toLowerCase(), newProps[key]);
        } else {
            dom[key] = newProps[key];
        }
    }
    for (let key in oldProps) {
        //老的有，新的没有，需要删除
        if (!newProps.hasOwnProperty(key)) {
            dom[key] = null;
        }
    }
}
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
    let oldDOM = oldVdom.dom;
    let newDOM = createDOM(newVdom);
    parentDOM.replaceChild(newDOM, oldDOM);
}
const ReactDOM = {
    render
}
export default ReactDOM;