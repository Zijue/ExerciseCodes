const Koa = require('./koa');

const app = new Koa();

// app.use(ctx => {
//     ctx.body = 'hi, zijue'
//     console.log('1', ctx.request.path);
//     console.log('2', ctx.request.query);
//     console.log('3', ctx.query);
//     ctx.response.body = 'response set body'
// })

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
