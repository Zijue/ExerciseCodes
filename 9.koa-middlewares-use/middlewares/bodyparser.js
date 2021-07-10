const path = require('path');
const fs = require('fs').promises;
const querystring = require('querystring');
const uuid = require('uuid');

Buffer.prototype.split = function (sep) {
    let arr = [];
    let offset = 0; // 偏移位置
    let current = 0; // 当前找到的索引
    let len = Buffer.from(sep).length; // 分隔符真实的长度，单位字节
    while (-1 != (current = this.indexOf(sep, offset))) { // 查找到位置（字节）的索引，只要有继续
        arr.push(this.slice(offset, current));
        offset = current + len;
    }
    arr.push(this.slice(offset));
    return arr;
}

function bodyParser({ dir } = {}) {
    return async (ctx, next) => {
        ctx.request.body = await new Promise((resolve, reject) => {
            // 接受请求的信息存入数组，待接受完毕之后运行处理逻辑
            let bufferArr = [];
            ctx.req.on('data', function (chunk) {
                bufferArr.push(chunk);
            });

            ctx.req.on('end', function () {
                let type = ctx.get('content-type');
                let body = Buffer.concat(bufferArr);
                if (type.startsWith('application/x-www-form-urlencoded')) { // 表单格式
                    resolve(querystring.parse(body.toString()));
                } else if (type.startsWith('application/json')) { // json格式
                    resolve(JSON.parse(body.toString()));
                } else if (type.startsWith('text/plain')) { // 纯文本格式，一般需要用户自行判断如何处理该数据
                    resolve(body.toString());
                } else if (type.startsWith('multipart/form-data')) { // form-data
                    let boundary = '--' + type.split('=')[1]; // content-type中的分隔符比实际传递的少两个'-'
                    let lines = body.split(boundary).slice(1, -1); // 切割之后的数组需要去除头尾
                    let formData = {};
                    lines.forEach(async function (line) {
                        /**
                            Content-Disposition: form-data; name="name"\r\n
                            \r\n
                            zijue
                         */
                        let [head, body] = line.split('\r\n\r\n'); // 规范中定义的key、value之间的填充
                        head = head.toString();
                        let key = head.match(/name="(.+?)"/)[1];
                        if (head.includes('filename')) { // 传递的是文件，需要将文件存储到服务器上
                            /*
                                Content-Disposition: form-data; name="upload"; filename="test.txt"
                                Content-Type: text/plain // 此处结尾有不可见字符 \r\n，共计两个字节
                                 // 此处结尾有不可见字符 \r\n，共计两个字节
                                Zijue

                                520

                                Xiaodai
                                 // 此处结尾有不可见字符 \r\n，共计两个字节
                             */
                            // 所以文件内容的区间就为[head部分长度+4, 行总长-2]
                            let fileContent = line.slice(head.length + 4, -2);
                            dir = dir || path.join(__dirname, 'upload');
                            let filePath = uuid.v4(); // 生成唯一文件名
                            let uploadPath = path.join(dir, filePath);
                            formData[key] = {
                                filename: uploadPath,
                                size: fileContent.length
                            }
                            await fs.writeFile(uploadPath, fileContent);
                        } else {
                            let value = body.toString();
                            formData[key] = value.slice(0, -2); // 去除结尾处的 \r\n
                        }
                    });
                    resolve(formData);
                } else {
                    resolve({});
                }
            })
        });
        await next(); // 解析请求体之后，继续向下执行
    }
}
module.exports = bodyParser;