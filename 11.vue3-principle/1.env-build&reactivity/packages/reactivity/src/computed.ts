import { isObject } from "@vue/shared";
import { effect } from "./effect";

class ComputedRefImpl {
    public effect;
    public _value;
    // public _dirty = true;
    constructor(public getter, public setter) {
        // computed本身就是一个effect，并且是懒执行的
        this.effect = effect(getter, { lazy: true });
    }
    // 如果用户不去计算属性中取值，就不会执行计算属性的effect
    get value() {
        this._value = this.effect();
        return this._value;
    }
    set value(newValue) {
        this.setter(newValue);
    }
}

export function computed(getterOrOptions) {
    let getter;
    let setter;

    if (isObject(getterOrOptions)) {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    } else {
        getter = getterOrOptions;
        setter = () => {
            throw Error('Computed cannot set value')
        }
    }
    return new ComputedRefImpl(getter, setter);
}