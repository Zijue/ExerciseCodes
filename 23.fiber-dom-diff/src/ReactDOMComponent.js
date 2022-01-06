import { REACT_TEXT } from "./ReactSymbols";

export function createElement(type) {
    return document.createElement(type);
}
export function setInitialProperties(domElement, type, props) {
    for (let propKey in props) {
        const nextProp = props[propKey];
        if (propKey === 'children') {
            if (nextProp.type === REACT_TEXT) {
                domElement.textContent = nextProp.props.content;
            }
        } else if (propKey === 'style') {
            for (let stylePropKey in nextProp) {
                domElement.style[stylePropKey] = nextProp[stylePropKey]
            }
        } else {
            domElement[propKey] = nextProp;
        }
    }
}