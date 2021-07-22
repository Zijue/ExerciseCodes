import { extend, hasChanged, hasOwnProp, isArray, isIntegerKey, isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";

function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        /**
         * target   代理的源对象
         * key      取值的属性
         * receiver 代理对象
         */
        // 一般使用Proxy会配合Reflect使用
        const res = Reflect.get(target, key, receiver);
        if (!isReadonly) { // 不是只读属性，收集此属性用于之后值变化时更新视图
            console.log('收集当前属性，之后属性值改变，更新视图', key);
        }
        if (isShallow) { // 浅代理，只代理第一层属性，更深层次不做处理
            return res;
        }
        if (isObject(res)) { // 懒代理；当我们取值时才去做递归代理，如果不取值默认只代理一层
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    }
}
function createSetter(isShallow = false) {
    /** 针对数组而言，如果调用push方法，就会产生两次触发
     * 1.第一次给数组新增了一项，同时也修改了长度
     * 2.因为修改了长度，所以第二次触发set（此次触发是无意义的）
     */
    return function set(target, key, value, receiver) {
        // 设置属性：新增、修改
        const oldValue = Reflect.get(target, key, receiver); // 获取老值
        /** 如何判断数组是新增还是修改
         * key是数字 && key < target.length => 新增
         * 否则就是修改
         */
        let hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwnProp(target, key);
        const res = Reflect.set(target, key, value, receiver); // 必须先判断是否有key，再更改值
        if (!hasKey) {
            console.log('新增');
        } else if (hasChanged(oldValue, value)) {
            console.log('修改');
        } else {
            console.log('无变化'); // 数组第二次触发会在此处，无意义，所以此处不添加逻辑
        }

        return res;
    }
}

const get = createGetter(); // 非只读，非浅代理
const shallowGet = createGetter(false, true); // 非只读，浅代理
const readonlyGet = createGetter(true); // 只读，非浅代理
const shallowReadonlyGet = createGetter(true, true); // 只读，浅代理
// readonly只读没有set
const set = createSetter(); // 非浅代理
const shallowSet = createSetter(true); // 浅代理

export const mutableHandler = {
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
const readonlySet = {
    set(target, key, value, receiver) {
        throw Error(`Proxy '${JSON.stringify(target)}' that property '${key}' is a read-only, cannot set '${key}' to '${value}'.`);
    }
}
/** Object.assign 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象
 * const target = { a: 1, b: 2 };
 * const source = { b: 4, c: 5 };
 * const returnedTarget = Object.assign(target, source);
 * console.log(target); // expected output: Object { a: 1, b: 4, c: 5 }
 * console.log(returnedTarget); // expected output: Object { a: 1, b: 4, c: 5 }
 */
export const readonlyHandlers = extend({
    get: readonlyGet
}, readonlySet);
export const shallowReadonlyHanlders = extend({
    get: shallowReadonlyGet
}, readonlySet);
