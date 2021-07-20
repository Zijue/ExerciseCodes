import path from 'path';
import ts from 'rollup-plugin-typescript2'; // 解析ts插件
import resolvePlugin from '@rollup/plugin-node-resolve'; // 解析第三方模块

// 获取packages目录
let packagesDir = path.resolve(__dirname, 'packages');
// 获取需要打包模块的路径
let pkgDir = path.resolve(packagesDir, process.env.TARGET);

const resolvePath = item => path.resolve(pkgDir, item); // 将用户传入的路径与打包模块目录合并

// 获取打包模块的package.json文件内容
let pkg = require(resolvePath('package.json'));
// 获取模块自定义参数
let pkgOpts = pkg.buildOptions;
// 获取模块的文件夹名称
let pathName = path.basename(pkgDir);
// 一个包需要打包成多个格式 esModule commonjs iife
const outputConfig = {
    'esm-bundler': {
        file: resolvePath(`dist/${pathName}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolvePath(`dist/${pathName}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: resolvePath(`dist/${pathName}.global.js`),
        format: 'iife'
    }
}
function createConfig(output){
    output.name = pkgOpts.name; // 用于 iife 在 window 上挂载的属性
    output.sourcemap = true; // 生成sourcemap，便于调试。tsconfig.json中也需要开启
    return {
        input: resolvePath('src/index.ts'), // 打包入口
        output,
        plugins: [
            ts({ // ts 编译时配置文件
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }
}
// 根据用户打包模块中提供的formats选项，去outputConfig配置里取值生成配置文件
export default pkgOpts.formats.map(format=>createConfig(outputConfig[format]));
