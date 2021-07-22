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
function createReactiveEffect(fn, options) {
    debugger;
    const effect = function reactiveEffect() {
        try {
            effectStack.push(effect);
            activeEffect = effect;
            return fn();
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
        }
    }
    effect.id = id++;
    return effect;
}
