import { isArray, isIntegerKey } from "@vue/shared";

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
    effect.__v_isEffect = true;
    effect.options = options;
    effect.deps = []; // effect用来收集依赖了哪些属性
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
export function trigger(target, action, key, newValue?, oldValue?) {
    // 去映射表中找到属性对应的effect，让其重新执行
    const depsMap = targetMap.get(target);
    if (!depsMap) return; // 只是改了属性，这个属性没有在effect中使用
    const effectSet = new Set();
    const add = (effects) => { // 如果同时有多个属性依赖的effect是同一个，new Set()会去重
        if (effects) {
            effects.forEach(effect => effectSet.add(effect));
        }
    }
    if (key === 'length' && isArray(target)) { // 当修改的是数组的length属性时，需要视情况触发更新
        depsMap.forEach((deps, key) => {
            if (key > newValue || key === 'length') { // 此处的key是收集依赖的属性
                add(deps); // 当收集的依赖的属性 < 更改的数组长度时，需要手动触发
            }
        });
    } else {
        add(depsMap.get(key)); // 将属性收集effects添加到统一的集合中
        // 当数组push值时，走trigger(target, 'add', key, value)新增触发逻辑，key为Int且数组未收集；所以此处也需要手动更新
        switch (action) {
            case 'add':
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length')); // 增加属性，需要触发length的依赖收集
                }
        }
    }
    effectSet.forEach((effect: any) => {
        // 数据变化时，原则上应该触发对应的effect让他重新执行，如果effect提供了scheduler，
        // 那么就让scheduler执行，而不是effect重新执行
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        } else {
            effect();
        }
    }); // 遍历所有收集的effect并执行
}