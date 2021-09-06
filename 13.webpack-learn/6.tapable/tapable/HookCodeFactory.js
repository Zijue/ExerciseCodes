class HookCodeFactory {
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(item => item.fn);
    }
    init(options) {
        this.options = options;
    }
    deinit() {
        this.options = null;
    }
    args(options = {}) { // 编译后的函数的形参
        let { before, after } = options; // 表示在 name, age 之前or之后传入参数
        let allArgs = this.options.args;
        if (before) allArgs = [before, ...allArgs];
        if (after) allArgs = [...allArgs, after];
        if (allArgs.length > 0) {
            return allArgs.join(', '); // name, age
        } else {
            return '';
        }
    }
    header() {
        let code = '';
        code += `var _x = this._x;\n`;
        let interceptors = this.options.interceptors;
        if (interceptors.length > 0) {
            code += `var _taps = this.taps;\n`;
            code += `var _interceptors = this.interceptors;\n`;
            for (let i = 0; i < interceptors.length; i++) {
                if (interceptors[i].call) { // 如果拦截器中有call方法，就拼字符串到字符串函数中
                    code += `_interceptors[${i}].call(${this.args()});\n`;
                }
            }
        }
        return code;
    }
    content() {
        throw new Error('子类应重写此方法');
    }
    create(options) { // options: {taps, args, type}
        this.init(options); // 将options赋给this.options，this是factory实例
        let fn;
        switch (options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content()
                )
                break;
            case 'async':
                fn = new Function(
                    this.args({ after: '_callback' }),
                    this.header() + this.content({ onDone: () => `_callback()\n` })
                )
                break;
            case 'promise':
                let tapsContent = this.content({ onDone: () => `_resolve();\n` });
                let content = `
                    return new Promise((function (_resolve, _reject) {
                        ${tapsContent}
                    }));
                `
                fn = new Function(this.args(), this.header() + content);
            default:
                break;
        }
        this.deinit();
        return fn;
    }
    callTap(tapIndex) {
        let code = '';
        let interceptors = this.options.interceptors;
        if (interceptors.length > 0) {
            code += `var _tap${tapIndex} = _taps[${tapIndex}];\n`;
            for (let i = 0; i < interceptors.length; i++) {
                if (interceptors[i].tap)
                    code += `_interceptors[${i}].tap(_tap${tapIndex});\n`;
            }
        }
        let tapInfo = this.options.taps[tapIndex];
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
        switch (tapInfo.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            case 'async':
                code += `_fn${tapIndex}(${this.args({
                    after: `function () {
                    if (--_counter === 0) _done();
                }`})});\n`;
            case 'promise':
                code += `
                    var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
                    _promise${tapIndex}.then(function () {
                        if (--_counter === 0) _done();
                    });\n
                `;
            default:
                break;
        }
        return code;
    }
    callTapSeries() {
        let taps = this.options.taps;
        if (taps.length === 0) {
            return '';
        }
        let code = '';
        for (let i = 0; i < taps.length; i++) {
            code += this.callTap(i);
        }
        return code
    }
    callTapParallel({ onDone }) {
        let taps = this.options.taps;
        if (taps.length === 0) {
            return '';
        }
        let code = `var _counter = ${taps.length};\n`;
        code += `var _done = function () {
            ${onDone()}
        };`;
        for (let i = 0; i < taps.length; i++) {
            code += this.callTap(i);
        }
        return code;
    }
}
module.exports = HookCodeFactory;