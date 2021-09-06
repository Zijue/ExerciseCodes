const CALL_DELEGATE = function (...args) {
    this.call = this._createCall('sync'); // 调用它的时候，他会动态创建call函数，重写this.call属性
    return this.call(...args); // 执行新创建的call方法，后续就不会走CALL_DELEGATE
}
const CALL_ASYNC_DELEGATE = function (...args) {
    this.callAsync = this._createCall('async'); // 调用它的时候，他会动态创建callAsync函数，重写this.callAsync属性
    return this.callAsync(...args); // 执行新创建的callAsync方法，后续就不会走CALL_ASYNC_DELEGATE
}
const PROMISE_DELEGATE = function (...args) {
    this.promise = this._createCall('promise');
    return this.promise(...args);
}
class Hook {
    constructor(args) { // ["name", "age"]
        if (!Array.isArray(args)) args = [];
        this.args = args; // 把参数的数组存放在钩子内部
        this.taps = []; // 存放事件函数配置对象的数组
        this.call = CALL_DELEGATE; // 初始化call方法，通过代理的方式，可以初次调用实现动态编译，后续调用都使用之前编译的结果
        this.callAsync = CALL_ASYNC_DELEGATE;
        this.promise = PROMISE_DELEGATE;
        this.interceptors = []; // 存放不同的拦截器对象的数组
    }
    tap(options, fn) {
        this._tap('sync', options, fn);
    }
    tapAsync(options, fn) {
        this._tap('async', options, fn);
    }
    tapPromise(options, fn) {
        this._tap('promise', options, fn);
    }
    intercept(interceptor) {
        this.interceptors.push(interceptor);
    }
    _runRegisterInterceptors(tapInfo) {
        for (let interceptor of this.interceptors) {
            if (interceptor.register) { // 如果它身上有注册拦截器的话，就执行register
                let newTapInfo = interceptor.register(tapInfo); // register有可能有返回值
                if (newTapInfo) { // 如果注册拦截器返回了新的tapInfo，就用新的替换老的
                    tapInfo = newTapInfo;
                }
            }
        }
        return tapInfo;
    }
    _tap(type, options, fn) {
        // 保证每个tap的tapInfo中有name属性
        if (typeof options === 'string') {
            options = { name: options }
        }
        let tapInfo = { ...options, type, fn }; // name 名称；type sync；fn 事件函数
        tapInfo = this._runRegisterInterceptors(tapInfo); // 将拦截器注册到tapInfo对象中
        this._insert(tapInfo);
    }
    _resetCompilation() {
        this.call = CALL_DELEGATE;
        this.callAsync = CALL_ASYNC_DELEGATE;
        this.promise = PROMISE_DELEGATE;
    }
    _insert(tapInfo) {
        this._resetCompilation(); // 每次调用call或者promise方法时，重新编译；为了处理调用call或promise方法后，还想添加事件函数的情况
        let i = this.taps.length; // 插入事件函数对象时总的长度
        this.taps[i] = tapInfo; // 直接存入了对应的位置，不用push的原因是，不一定都是往数组尾部添加
    }
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            args: this.args,
            type,
            interceptors: this.interceptors // 动态编译时将拦截器传入
        })
    }
    compile(options) { // 此方法需要被继承Hook的子类重写
        throw new Error('子类应重写此方法');
    }
}
module.exports = Hook;