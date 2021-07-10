const Koa = require('koa');
const path = require('path');
const bodyParser = require('./middlewares/bodyparser');
const static = require('./middlewares/static');
const Router = require('./middlewares/router');
const login = require('./login');


const app = new Koa();

app.use(bodyParser({ dir: path.resolve(__dirname, 'upload') })); // 应用解析请求体中间件
app.use(static(path.resolve(__dirname, 'static')));

// login(app);
router = new Router();
router.get('/login', async (ctx, next) => {
    console.log('login-1');
    await next();
})
router.get('/login', async (ctx, next) => {
    console.log('login-2')
    await next()
})
router.post('/login', async (ctx, next) => {
    console.log('login-post')
    await next();
})
app.use(router.routes()); // 中间件的执行顺序是从上到下

// app.use(async (ctx, next) => {
//     ctx.body = await ctx.request.body;
// })

app.listen(3000, function () {
    console.log(`server start 3000 `)
});
