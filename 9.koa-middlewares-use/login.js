module.exports = function (app) {
    app.use(async (ctx, next) => {
        if (ctx.path === '/login' && ctx.method == 'POST') {
            // 验证用户密码，生成cookie之类的
            console.log('todo');
        } else {
            await next();
        }
    });
}
