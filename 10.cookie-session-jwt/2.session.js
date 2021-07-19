const Koa = require('koa');
const Router = require('@koa/router');
const uuid = require('uuid');


const app = new Koa();
const router = new Router();

let session = {}; //session可以理解为一个服务器记账的本子，为了稍后能通过这个本子找到具体信息

router.get('/consume', async function (ctx) {
    let hasVisit = ctx.cookies.get(cardName, { signed: true });
    if (hasVisit && session[hasVisit]) {
        session[hasVisit].mny -= 100;
        ctx.body = '恭喜你消费了 ' + session[hasVisit].mny
    } else {
        const id = uuid.v4();
        session[id] = { mny: 500 };
        ctx.cookies.set(cardName, id, { signed: true });
        ctx.body = '恭喜你已经是本店会员了 有500元'
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, function () {
    console.log('server start 3000');
});