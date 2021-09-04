// const { runLoaders } = require('loader-runner');
const { runLoaders } = require('./loader-runner')
const path = require('path');
const fs = require('fs');

const entryFile = path.resolve(__dirname, 'src/index.js');
// 如何配置行内
let request = `!inline-loader1!inline-loader2!${entryFile}`; // 通过 ! 分隔
// 配置非行内loader
let rules = [
    {
        test: /\.js$/,
        use: ['normal-loader1', 'normal-loader2']
    },
    {
        test: /\.js$/,
        use: ['post-loader1', 'post-loader2'],
        enforce: 'post'
    },
    {
        test: /\.js$/,
        use: ['pre-loader1', 'pre-loader2'],
        enforce: 'pre'
    },
];
// let parts = request.split('!');
// 需要对行内的特殊配置进行处理 -! ! !! 替换成空
let parts = request.replace(/^-?!+/, '').split('!');
let resource = parts.pop(); // 弹出最后一个元素，entryFile 'src/index.js'
let inlineLoaders = parts; // 剩下的就是行内loader，[inline-loader1, inline-loader2]
// 整理loader，将loader放到对应的数组中
let preLoaders = [], postLoaders = [], normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
    let rule = rules[i];
    if (rule.test.test(resource)) {
        if (rule.enforce === 'pre') {
            preLoaders.push(...rule.use);
        } else if (rule.enforce === 'post') {
            postLoaders.push(...rule.use);
        } else {
            normalLoaders.push(...rule.use);
        }
    }
}
// console.log(resource); // /xxx/xxx/src/index.js
// console.log(postLoaders); // [ 'post-loader1', 'post-loader2' ]
// console.log(inlineLoaders); // [ 'inline-loader1', 'inline-loader2' ]
// console.log(normalLoaders); // [ 'normal-loader1', 'normal-loader2' ]
// console.log(preLoaders); // [ 'pre-loader1', 'pre-loader2' ]

// 行内的特殊配置处理
let loaders = [];
if (request.startsWith('!!')) { // noPrePostAutoLoaders
    loaders = [...inlineLoaders];
} else if (request.startsWith('-!')) { // noPreAutoLoaders
    loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) { // noAutoLoaders
    loaders = [...postLoaders, ...inlineLoaders, ...preLoaders]
} else {
    loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
// 加载loader的绝对路径
let resolveLoader = loader => path.resolve(__dirname, 'loaders-chain', loader);
loaders = loaders.map(resolveLoader); // 把loaders数组从名称变成绝对路径
// 调用runLoaders方法
runLoaders({
    resource, // 需要加载的资源
    loaders,
    context: { name: 'zijue' }, // 保存一些状态和值
    readResource: fs.readFile // 读取源文件的方式，此处用的是磁盘读写，但是有使用memory-fs的情况，例如：devServer
}, (err, result) => {
    console.log(err); // 运行错误
    console.log(result); // 运行的结果
    console.log(result.resourceBuffer ? result.resourceBuffer.toString('utf8') : null); // 读取的原始文件
})