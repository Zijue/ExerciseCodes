let { SyncHook } = require('./tapable');
const syncHook = new SyncHook(['name', 'age']);
syncHook.intercept({
    register(tapInfo) { //每当你添加一个新的事件函数就会触发
        console.log(`拦截器1 register`, tapInfo.name);
        return tapInfo;
    },
    tap(tapInfo) { //每当一个事件函数执行了就会触发
        console.log(`拦截器1 tap`, tapInfo.name);
    },
    call(name, age) { //每次调用call会触发一次
        console.log(`拦截器1 call`, name, age);
    }
});
syncHook.intercept({
    register(tapInfo) {
        console.log(`拦截器2 register`, tapInfo.name);
        return tapInfo;
    },
    tap(tapInfo) {
        console.log(`拦截器2 tap`, tapInfo.name);
    },
    call(name, age) {
        console.log(`拦截器2 call`, name, age);
    }
});
syncHook.tap('事件函数A', (name, age) => {
    console.log('事件函数A', name, age);
})
syncHook.tap('事件函数B', (name, age) => {
    console.log('事件函数B', name, age);
})
debugger
syncHook.call('zhufeng', 12);
/**
(function anonymous(name, age) {
    var _x = this._x;
    var _taps = this.taps;
    var _interceptors = this.interceptors;
    _interceptors[0].call(name, age);
    _interceptors[1].call(name, age);
    
    var _tap0 = _taps[0];
    _interceptors[0].tap(_tap0);
    _interceptors[1].tap(_tap0);
    var _fn0 = _x[0];
    _fn0(name, age);
    
    var _tap1 = _taps[1];
    _interceptors[0].tap(_tap1);
    _interceptors[1].tap(_tap1);
    var _fn1 = _x[1];
    _fn1(name, age);
})
 */