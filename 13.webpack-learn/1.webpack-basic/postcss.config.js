// 兼容性设置
let postcssPresetEnv = require('postcss-preset-env');
module.exports = {
    plugins: [postcssPresetEnv({
        browsers: 'last 5 version' // 兼容最新的五个版本
    })]
}