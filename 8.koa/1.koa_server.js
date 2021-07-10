const Koa = require('koa');

const app = new Koa();

// app.use(ctx => {
//     console.log(ctx.req.url); // http原生的
//     console.log(ctx.request.req.url); // koa上封装的request上有req属性。这是为了在request对象中可以通过this获取到原生的req

//     console.log(ctx.request.query); // koa封装的
//     console.log(ctx.query); // koa中封装的request对象的属性被代理到了ctx对象上

//     ctx.body = 'zijue'; // 最终会执行 res.end(ctx.body)

//     console.log(ctx.response.res); // koa上封装的response上有res属性(http原生的)
//     console.log(ctx.response.body); // 同样的，koa中封装的response对象的属性被代理到了ctx对象上
// });

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('sleep');
            resolve();
        }, time);
    })
}

app.use(async (ctx, next) => {
    console.log('1');
    await next();
    console.log('2');
    ctx.body = 'hi, zijue ~~'
});

app.use(async (ctx, next) => {
    console.log('3');
    await sleep(1000);
    await next();
    console.log('4');
});

app.use(async (ctx, next) => {
    console.log('5');
    await next();
    console.log('6');
});

app.listen(3000, function () {
    console.log('Koa server start at 3000');
});

app.on('error', function (err) {
    console.log('err: ', err)
});
