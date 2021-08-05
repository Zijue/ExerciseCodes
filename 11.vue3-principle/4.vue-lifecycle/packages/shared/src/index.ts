export function isObject(val) {
    return typeof val == 'object' && val !== null;
}
export const isFunction = (val) => typeof val == 'function';
export const isVnode = (val) => val.__v_isVnode == true;
export const extend = Object.assign;

export const isArray = Array.isArray;
export const isString = (val) => typeof val == 'string';

export const isIntegerKey = (key) => {
    return parseInt(key) + '' === key;
}

export const hasOwnProp = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

export function hasChanged(oldValue, newValue) {
    return oldValue !== newValue;
}

// 用于组合
export const enum ShapeFlags {
    ELEMENT = 1, // 标识是一个元素
    FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件
    STATEFUL_COMPONENT = 1 << 2, // 带状态的组件
    TEXT_CHILDREN = 1 << 3, // 这个组件的孩子是文本
    ARRAY_CHILDREN = 1 << 4, // 孩子是数组
    SLOTS_CHILDREN = 1 << 5, // 插槽孩子
    TELEPORT = 1 << 6, // 传送门
    SUSPENSE = 1 << 7, // 实现异步组件等待
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 是否需要keep-alive
    COMPONENT_KEPT_ALIVE = 1 << 9, // 组件的keep-alive
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

export function invokeArrayFns(fns) {
    fns.forEach(fn => fn());
}