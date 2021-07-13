const fs = require('fs').promises;

async function renderFile(filepath, data) {
    let tplStr = await fs.readFile(filepath, 'utf-8');
    let template = `let str = ''\r\n`;
    template += 'with(obj){';
    template += 'str+=`'
    tplStr = tplStr.replace(/<%=(.*?)%>/g, function () {
        return '${' + arguments[1] + '}'
    });
    template += tplStr.replace(/<%(.*?)%>/g, function () {
        return '`\r\n' + arguments[1] + '\r\nstr+=`'
    });
    template += '`\r\n return str \r\n}'
    let fn = new Function('obj', template);
    return fn(data);
}

async function render(tplStr, data) {
    let template = `let str = ''\r\n`;
    template += 'with(obj){';
    template += 'str+=`'
    tplStr = tplStr.replace(/<%=(.*?)%>/g, function () {
        return '${' + arguments[1] + '}'
    });
    template += tplStr.replace(/<%(.*?)%>/g, function () {
        return '`\r\n' + arguments[1] + '\r\nstr+=`'
    });
    template += '`\r\n return str \r\n}'
    let fn = new Function('obj', template);
    return fn(data);
}

module.exports.render = render;
module.exports.renderFile = renderFile;