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
    args() { // 编译后的函数的形参
        let allArgs = this.options.args;
        if (allArgs.length > 0) {
            return allArgs.join(', '); // name, age
        } else {
            return '';
        }
    }
    header() {
        let code = '';
        code += `var _x = this._x;\n`;
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
                    this.args(),
                    this.header() + this.content({ onDone: () => `_callback()\n` })
                )
                break;
            default:
                break;
        }
        this.deinit();
        return fn;
    }
    callTap(tapIndex) {
        let code = '';
        let tapInfo = this.options.taps[tapIndex];
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
        switch (tapInfo.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            case 'async':
                // TODO
                code += `_fn${tapIndex}(${this.args()})`
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