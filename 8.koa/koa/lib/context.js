const context = {}

function defineGetter(target, key) {
    context.__defineGetter__(key, function () {
        return this[target][key]
    })
}

function defineSetter(target, key) {
    context.__defineSetter__(key, function (val) {
        this[target][key] = val;
    })
}

// 此处按照koa源码使用的api编写，也可以使用defineProperty、proxy等方式
defineGetter('request', 'query');
defineGetter('request', 'path');

defineGetter('response', 'body');
defineSetter('response', 'body');

module.exports = context;