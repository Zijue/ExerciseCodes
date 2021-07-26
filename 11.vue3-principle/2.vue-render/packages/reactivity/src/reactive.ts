import { isObject } from '@vue/shared';
import { mutableHandler, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHanlders } from "./handlers";

export function reactive(target) {
    return createReactiveObject(target, false, mutableHandler);
}
export function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers);
}
export function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers);
}
export function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHanlders);
}
/** weakMap 与 map
 * weakMap -> key 只能是对象；weakMap是弱引用，如果对象key被销毁，weakMap可以自动释放掉
 * map -> key 可以是其它类型
 */
// 添加缓存
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap(); // reactive与readonly代理对象的结果是不一样的，所以需要将两者分别缓存

function createReactiveObject(target, isReadonly, baseHandler) {
    /**
     * target  创建代理的目标
     * isReadonly  是否为只读
     * baseHandler  针对不同的方式创建不同的代理对象
     */
    if (!isObject(target)) {
        return target;
    }
    let proxyMap = isReadonly ? readonlyMap : reactiveMap;
    let existProxy = proxyMap.get(target);
    if (existProxy) {
        return existProxy;
    }
    // 如果是对象，就做代理 new Proxy
    let proxy = new Proxy(target, baseHandler);
    proxyMap.set(target, proxy);
    return proxy;
}
