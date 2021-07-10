class Layer {
    constructor(path, method, callback) {
        this.path = path;
        this.method = method;
        this.callback = callback;
    }
    match(path, method) {
        return this.path == path && this.method == method.toLowerCase()
    }
}

class Router {
    constructor() {
        this.stack = [];
    }
    compose(layers, ctx, next) {
        let dispatch = (i) => {
            if (i == layers.length) return next();
            let callback = layers[i].callback;
            return Promise.resolve(callback(ctx, () => dispatch(i + 1)))
        }
        return dispatch(0);
    }
    routes() {
        return async (ctx, next) => { // app.routes()的返回结果，标准的中间件函数
            let path = ctx.path;
            let method = ctx.method;
            // 当请求来临时，从暂存的栈中过滤出与之相匹配的路径，可能有多个
            let layers = this.stack.filter(layer => layer.match(path, method));
            this.compose(layers, ctx, next);
        }
    }
};

['get', 'post'].forEach(method => [
    Router.prototype[method] = function (path, callback) {
        let layer = new Layer(path, method, callback);
        this.stack.push(layer);
    }
])

module.exports = Router;