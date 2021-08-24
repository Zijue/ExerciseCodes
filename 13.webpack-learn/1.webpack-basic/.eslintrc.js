/**
 * 配置文件是可以有层次结构 可以继承
 */
module.exports = {
    root: true, //注释掉这行，就表示这个不再是一个根配置文件
    //extends: 'airbnb', // 继承自airbnb提供的配置文件
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2015,
    },
    env: {
        browser: true, // window.a
        node: true,
    },
    // 启用的代码检查规则和各自的错误级别
    // 先进行代码检查 ，如果发现不正确 ，会尝试修复，如果修复成果，接着执行
    rules: {
        indent: ["error", 4], // 缩进风格
        quotes: "off", // 引号的类型
        "no-console": "off", // 禁止使用 console.log
        "linebreak-style": "off", // 关闭CRLF检查，windows上文件换行是\r\n，unix上是\n
    },
};
