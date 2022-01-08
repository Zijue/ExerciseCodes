import { createElement, setInitialProperties, diffProperties } from "./ReactDOMComponent";
import { REACT_TEXT } from "./ReactSymbols";

/**
 * 如果子节点只是一个文本，就设置它的文本内容就行，不需要创建子fiber节点
 * @param {*} type 
 * @param {*} pendingProps 
 * @returns 
 */
export function shouldSetTextContent(type, pendingProps) {
    return pendingProps.children.type === REACT_TEXT;
}
export function createInstance(type) {
    return createElement(type);
}
export function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
}
export function finalizeInitialChildren(domElement, type, props) {
    setInitialProperties(domElement, type, props);
}
export function prepareUpdate(domElement, type, oldProps, newProps) {
    return diffProperties(domElement, type, oldProps, newProps);
}
export function removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
}