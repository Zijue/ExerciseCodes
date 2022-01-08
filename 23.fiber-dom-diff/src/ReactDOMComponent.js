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
export function diffProperties(domElement, tag, lastProps, nextProps) {
    let updatePayload = null;
    let propKey;
    for (propKey in lastProps) {
        if (!nextProps.hasOwnProperty(propKey)) {
            //updatePayload更新数组结构：[更新的key1, 更新的value1, 更新的key2, 更新的value2]
            (updatePayload = updatePayload || []).push(propKey, null);
        }
    }
    for (propKey in nextProps) {
        const nextProp = nextProps[propKey];
        if (propKey == 'children') {
            if (nextProp.type === REACT_TEXT) {
                const lastProp = lastProps[propKey];
                if (!(lastProp.type === REACT_TEXT && lastProp.props.content === nextProp.props.content)) {
                    (updatePayload = updatePayload || []).push(propKey, nextProp);
                }
            }
        } else {
            if (nextProp !== lastProps[propKey]) {
                (updatePayload = updatePayload || []).push(propKey, nextProp);
            }
        }
    }
    return updatePayload;
}
export function updateProperties(domElement, updatePayload) {
    for (let i = 0; i < updatePayload.length; i += 2) {
        const propKey = updatePayload[i];
        const propValue = updatePayload[i + 1];
        if (propKey === 'children') {
            domElement.textContent = propValue.props.content;
        } else {
            domElement.setAttribute(propKey, propValue);// id
        }
    }
}