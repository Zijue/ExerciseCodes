export function effect(fn, options: any = {}) {
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
let activeEffect; // 当前调用的effect
const effectStack = [];
let id = 0;
// 当用户取值的时候，需要将activeEffect和属性做关联
// 当用户更改属性值的时候，要通过属性找到effect从新执行
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        try {
            effectStack.push(effect);
            activeEffect = effect;
            return fn(); // 会取值
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
        }
    }
    effect.id = id++;
    return effect;
}
// 一个属性对应多个effect，一个effect对应多个属性 ==> 多对多的关系
const targetMap = new WeakMap();
export function track(target, action, key) {
    /**
    targetMap = WeakMap{
        target: Map{
            key: Set(Effect1, Effect2)
        }
    }
     */
    if (activeEffect == undefined) {
        return; // 用户只是取值，而且这个值不是在effect中使用的，什么都不用收集
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
}
export function trigger(target, action, key, newValue, oldValue?) {

}