import { hasChanged, isArray, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { reactive } from "./reactive";

export function ref(value) { // 可以传入对象
    // 把普通值变成一个引用类型，让一个普通值也具备响应式的能力
    return createRef(value);
}
export function shallowRef(value) {
    return createRef(value, true);
}
const convert = (v) => isObject(v) ? reactive(v) : v;
class RefImpl {
    public _value;
    public __v_isRef = true; // 表示它是一个ref
    constructor(public rawValue, public shallow) {
        this._value = shallow ? rawValue : convert(rawValue);
    }
    get value() {
        track(this, 'get', 'value'); // 收集依赖
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(this.rawValue, newValue)) {
            this.rawValue = newValue; // 用于下次对比
            this._value = this.shallow ? newValue : convert(newValue);
            trigger(this, 'set', 'value', newValue); // 触发依赖
        }
    }
}
function createRef(value, shallow = false) {
    return new RefImpl(value, shallow); // ref实现需要借助类的属性访问器
}

class ObjectRefImpl {
    public __v_isRef = true;
    constructor(public target, public key) { }
    get value() {
        return this.target[this.key];
    }
    set value(newValue) {
        this.target[this.key] = newValue;
    }
}
export function toRef(target, key) {
    return new ObjectRefImpl(target, key);
}
export function toRefs(target) {
    const res = isArray(target) ? new Array(target.length) : {};
    for (let key in target) {
        res[key] = toRef(target, key);
    }
    return res;
}