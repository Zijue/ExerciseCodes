const Koa = require('koa');
const Router = require('@koa/router');
const querystring = require('querystring');
const crypto = require('crypto');

const app = new Koa();
const router = new Router();

const secret = 'zijue-secret'; // 秘钥，也就是加的盐

// 当浏览器请求时，会处理cookie中传递的值，将base64中的= + /忽略掉，所以我们传递前需要对这些值进行处理
const toBase64URL = (str) => {
    return str.replace(/\=/g, '').replace(/\+/g, '-').replace(/\//, '_');
}

app.use(async (ctx, next) => {
    const cookies = [];
    ctx.myCookies = {
        set(key, value, options = {}) {
            let opts = [];
            if (options.domain) {
                opts.push(`domain=${options.domain}`)
            }
            if (options.httpOnly) {
                opts.push(`httpOnly=${options.httpOnly}`)
            }
            if (options.maxAge) {
                opts.push(`max-age=${options.maxAge}`)
            }
            if (options.signed) {
                let sign = crypto.createHmac('sha1', secret).update([key, value].join('=')).digest('base64');
                sign = toBase64URL(sign);
                cookies.push(`${key}-sign=${sign}`);
            }

            cookies.push(`${key}=${value}; ${opts.join('; ')}`);
            ctx.res.setHeader('Set-Cookie', cookies)
        },
        get(key, options = {}) {
            let cookieObj = querystring.parse(ctx.req.headers['cookie'], '; ');
            if (options.signed) {
                // 先获取上一次的签名
                let lastSign = cookieObj[`${key}-sign`];
                // 再次摘要传递的键值对获取新的签名
                let sign = toBase64URL(crypto.createHmac('sha1', secret).update([key, cookieObj[key]].join('=')).digest('base64'));
                if (sign == lastSign) {
                    return cookieObj[key];
                } else {
                    throw new Error('cookie被篡改')
                }
            }
            return cookieObj[key] || '';
        }
    }
    return next();
})

router.get('/write', async function (ctx) {
    ctx.myCookies.set('name', 'zijue', {
        domain: '.test.zijue.cn',
        httpOnly: true
    });
    ctx.myCookies.set('age', '12', { signed: true });

    ctx.body = 'ok'
});

router.get('/read', async function (ctx) {
    ctx.body = ctx.myCookies.get('age', { signed: true });
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, function () {
    console.log('server start 3000');
});