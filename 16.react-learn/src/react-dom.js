import { REACT_TEXT } from "./constants";

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
    let { type, props } = vdom;
    let dom; //真实dom
    if (type === REACT_TEXT) { //创建文本节点
        dom = document.createTextNode(props.content);
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
    return dom;
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
const ReactDOM = {
    render
}
export default ReactDOM;