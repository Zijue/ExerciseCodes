import { isObject } from "@vue/shared";
import { effect, track, trigger } from "./effect";

class ComputedRefImpl {
    public effect;
    public _value;
    public _dirty = true;
    constructor(public getter, public setter) {
        // computed本身就是一个effect，并且是懒执行的
        this.effect = effect(getter, {
            lazy: true,
            scheduler: (effect) => {
                // 自己实现触发调度逻辑
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(this, 'get', 'value'); // 当计算属性依赖的属性改变时，触发计算属性收集的依赖
                }
            }
        });
    }
    // 如果用户不去计算属性中取值，就不会执行计算属性的effect
    get value() {
        if (this._dirty) {
            this._value = this.effect(); // .value时执行effect，返回值就是计算后的属性值
            this._dirty = false; // 取完值后，将计算属性设为干净的，避免.value每次都去执行effect影响性能
        }
        track(this, 'get', 'value'); // 计算属性也要收集依赖
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