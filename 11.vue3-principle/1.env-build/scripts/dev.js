const execa = require('execa');

async function build(target) {
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' });
}
build('reactivity'); // 仅打包响应式模块
