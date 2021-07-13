const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const mime = require('mime'); // 服务器需要在响应头中指定文件类型和编码，不然浏览器解析出错
const chalk = require('chalk'); // 终端显示颜色
const os = require('os');
const { createReadStream } = require('fs');
const { render } = require('./utils');
const zlib = require('zlib');

// 获取本机IP地址
let address = Object.values(os.networkInterfaces()).flat().find(item => item.family == 'IPv4' && item.address != '127.0.0.1').address;

class Server {
    constructor(opts = {}) {
        this.port = opts.port;
        this.directory = opts.directory;
    }
    async handleRequest(req, res) {
        // 1.请求到来的时候，需要监控路径；检查路径是否是文件，如果是文件，直接将文件返回，如果不是，则读取目录
        let { pathname } = url.parse(req.url);
        pathname = decodeURIComponent(pathname); // 请求url中有中文时，url会被浏览器转义成buffer，服务器拿到后无法直接使用，需要解析一下
        let filepath = path.join(this.directory, pathname); // 在当前执行目录下查找
        try {
            let statObj = await fs.stat(filepath);
            if (statObj.isDirectory(filepath)) { // 目录
                let dirs = await fs.readdir(filepath);
                // 使用模板的方式渲染数据
                const template = await fs.readFile(path.resolve(this.directory, 'templates/dir-tpl.html'), 'utf8');
                let content = await render(template, {
                    dirs: dirs.map(dir => ({
                        url: path.join(pathname, dir),
                        dir
                    }))
                })
                res.setHeader('Content-Type', 'text/html;charset=utf-8')
                res.end(content);
            } else { // 文件
                this.sendFile(req, res, filepath);
            }
        } catch (e) {
            this.sendError(res, e)
        }
    }
    compress(req, res) {
        let encoding = req.headers['accept-encoding'];
        let zip;
        // 此处可以优化为：如果是图片就不要压缩；文件真实类型识别较繁琐，跟主题偏离较远，不做处理。感兴趣可以看此：https://programmer.group/node.js-recognizes-picture-types.html
        if (encoding) {
            let fmts = encoding.split(', ');
            for (let i = 0; i < fmts.length; i++) {
                let lib = fmts[i];
                if (lib == 'gzip') {
                    res.setHeader('content-encoding', 'gzip');
                    zip = zlib.createGzip(); // 此函数返回的就是一个转化流
                    break
                } else if (lib == 'deflate') {
                    res.setHeader('content-encoding', 'deflate');
                    zip = zlib.createDeflate(); // 此函数返回的就是一个转化流
                    break
                }
            }
        }
        return zip;
    }
    sendFile(req, res, filepath) {
        res.setHeader('Content-Type', (mime.getType(filepath) || 'text/plain') + ';charset=utf-8');
        /* 如果进行压缩处理：
            浏览器 -> 服务器    accept-encoding: gzip, deflate, br
            服务器 -> 浏览器    content-encoding: gzip
         */
        let zip = this.compress(req, res);
        if (zip) {
            createReadStream(filepath).pipe(zip).pipe(res);
        } else {
            createReadStream(filepath).pipe(res);
        }
    }
    sendError(res, e) { // 统一错误处理
        console.log('err: ', e);
        res.statusCode = 404;
        res.end('Not Found');
    }
    start() {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(this.port, () => {
            console.log(`${chalk.yellow('Starting up http-server, serving: ')}` + this.directory)
            console.log(`  http://${address}:${chalk.green(this.port)}`)
            console.log(`  http://127.0.0.1:${chalk.green(this.port)}`)
        });
    }
}
module.exports = Server;