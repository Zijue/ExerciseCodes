// 针对monorepo进行编译的脚步文件

const fs = require('fs');
const execa = require('execa');

// 1.解析packages目录，过滤出所有的目录（即需要打包的模块）
const dirs = fs.readdirSync('packages').filter(item => {
    if (!fs.statSync(`packages/${item}`).isDirectory()) {
        return false;
    }
    return true;
});

// 2.并行打包所有文件夹
async function build(target) {
    /* 
     * -c 表示使用配置文件rollup.config.js
     * --environment 表示rollup执行时传递环境变量，此处传递的环境变量为`TARGET:${target}`
     * { stdio: 'inherit' } 表示子进程输出打印到父进程标准输出中
     */
    try{
        await execa('rollup', ['-c', '--environment', `TARGET:${target}`, { stdio: 'inherit' }]);
    }catch(e){
        throw e
    }
}
async function runParallel(dirs, iteratorFn) {
    let result = [];
    for (let item of dirs) {
        result.push(iteratorFn(item));
    }
    return Promise.all(result); // 待所有打包操作完毕后，调用成功
}
runParallel(dirs, build).then(() => {
    console.log('打包成功');
}).catch(e=>{
    console.log(e)
})
