const execa = require('execa');

async function build(target) {
    // -cw 表示打包并监视文件文件变化
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' });
}
build('runtime-dom'); // 打包runtime-dom模块
