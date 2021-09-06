class HookMap {
    constructor(factory) {
        this._map = new Map();
        this._factory = factory; // 用来创建hook的工厂
    }
    get(key) { // 返回map中这个key对应的hook
        return this._map.get(key);
    }
    for(key) { // 根据key返回一个hook，没有则创建
        const hook = this.get(key);
        if (hook) return hook;
        let newHook = this._factory();
        this._map.set(key, newHook);
        return newHook;
    }
}
module.exports = HookMap;