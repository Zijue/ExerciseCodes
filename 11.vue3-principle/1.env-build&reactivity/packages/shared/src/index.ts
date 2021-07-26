export function isObject(val) {
    return typeof val == 'object' && val !== null;
}

export const extend = Object.assign;

export const isArray = Array.isArray;

export const isIntegerKey = (key) => {
    return parseInt(key) + '' === key;
}

export const hasOwnProp = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

export function hasChanged(oldValue, newValue) {
    return oldValue !== newValue;
}