const path = require('path')
const fs = require('fs').promises

function static(staticPath) {
    return async (ctx, next) => {
        try {
            let filePath = path.join(staticPath, ctx.path);
            let statObj = await fs.stat(filePath);
            if (statObj.isDirectory()) { // 如果是文件夹 会查找index.html
                filePath = path.join(filePath, 'index.html')
            }
            ctx.body = await fs.readFile(filePath, 'utf-8');
        } catch (e) { // 报错说明处理不了 没有这个文件
            await next(); // 继续向下执行
        }
    }
}
module.exports = static;