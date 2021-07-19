const Koa = require('koa');
const Router = require('@koa/router');
const crypto = require('crypto');

const app = new Koa();
const router = new Router();
const secret = 'zijue-secret';

const jwt = { // 仅展示原理，部分逻辑写死
    header: {
        'typ': 'JWT',
        'alg': 'HS256',
    },
    toBase64Url(str) { // 将base64中的=、+、\替换成base64Url规定值
        return str.replace(/\=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    },
    toBase64(content) {
        return this.toBase64Url(Buffer.from(JSON.stringify(content)).toString('base64'));
    },
    base64UrlUnescape(str) { // 将base64Url反解为base64
        /**
         * new Array(2) ==> [empty*3]
         * [empty*3].join('=') ==> '=='
         */
        str += new Array(5 - str.length % 4).join('='); // 末尾补=
        return str.replace(/-/g, '+').replace(/_/g, '/');
    },
    sign(content, secret) { // 将header、payload生成签名的方法
        return this.toBase64Url(crypto.createHmac('sha256', secret).update(content).digest('base64'));
    },
    encode(payload, secret) { // 生成token方法
        let header = this.toBase64(this.header);
        let content = this.toBase64(payload);
        let sign = this.sign([header, content].join('.'), secret);
        return [header, content, sign].join('.');
    },
    decode(token, secret) { // 解析token方法，未做过期时间校验
        let [header, payload, sign] = token.split('.');
        let newSign = this.sign([header, payload].join('.'), secret);
        if (newSign == sign) {
            return JSON.parse(Buffer.from(this.base64UrlUnescape(payload), 'base64').toString());
        } else {
            throw new Error('数据被篡改');
        }
    }
}

router.get('/login', async (ctx, next) => {
    let payload = {
        'id': '31914',
        'name': 'zijue',
        'exp': new Date(Date.now() + 15 * 60 * 1000).toUTCString() // 令牌过期时间
    }
    // 生成令牌token；数据不宜过大，一般情况下放id即可
    let token = jwt.encode(payload, secret);
    ctx.body = {
        err: 0,
        data: {
            payload,
            token
        }
    }
});

router.get('/validate', async (ctx, next) => {
    try {
        // jwt规范 Authorization: Bearer <token>；此处直接 Authorization: <token> 替代
        let token = ctx.get('Authorization'); // 将token放在请求头中，有效避免跨域的问题，是一种优雅的方式
        let payload = jwt.decode(token, secret);
        ctx.body = {
            err: 0,
            data: {
                payload
            }
        }
    } catch (e) {
        ctx.body = {
            err: 1
        }
    }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, function () {
    console.log('server start at 3000')
});
