const execa = require('execa');

async function build(target) {
    // -cw 表示打包并监视文件文件变化
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' });
}
build('reactivity'); // 仅打包响应式模块
