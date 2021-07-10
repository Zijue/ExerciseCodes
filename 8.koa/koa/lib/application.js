const EventEmitter = require('events');
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa extends EventEmitter {
    constructor() {
        super();
        // 通过原型链的方式，保证应用之间的隔离；否则多个应用共享一个上下文，会造成混乱
        this.context = Object.create(context); // this.context.__proto__ = context
        this.request = Object.create(request);
        this.response = Object.create(response);
        this.middlewares = [];
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    compose(ctx) {
        // 将middlewares中的所有方法拿出来，先调用第一个，第一个完毕后，会调用next，再去调用执行第二个
        let index = -1; // 执行标识
        let dispatch = (i) => {
            if (i <= index) return Promise.reject('next() called multiple times.');
            index = i;
            if (this.middlewares.length == i) return Promise.resolve(); // 当 执行下标 == 中间件长度，表示所有中间件执行完毕
            return Promise.resolve(this.middlewares[i](ctx, () => dispatch(i + 1))); // 否则，执行当前下标的中间件，并将下标后移的next函数传入中间件
        }
        return dispatch(0);
    }
    createContext(req, res) {
        // 处理应用间上下文需要隔离，一个应用下的多个请求之间也是需要隔离上下文的。保证每次请求对象和响应对象的独立
        const ctx = Object.create(this.context); // ctx.__proto__.__proto__ = context
        const request = Object.create(this.request);
        const response = Object.create(this.response);

        ctx.request = request; // request.xxx 都是封装的
        ctx.req = ctx.request.req = req; // req.xxx 就是原生的
        ctx.response = response;
        ctx.res = ctx.response.res = res;
        return ctx
    }
    handleRequest(req, res) {
        const ctx = this.createContext(req, res);
        res.statusCode = 404;
        this.compose(ctx).then(() => {
            if (ctx.body) {
                res.end(ctx.body);
            } else {
                res.end('Not Found');
            }
        }).catch(err => {
            this.emit('error', err);
        })
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
}
module.exports = Koa;
