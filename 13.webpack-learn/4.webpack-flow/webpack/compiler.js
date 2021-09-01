const path = require('path');
const fs = require('fs');
const { SyncHook } = require('tapable');
const Complication = require('./complication')

// Compiler负责整个编译过程，里面保存整个编译的所有信息
class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), // 会在开始编译时触发
            done: new SyncHook(), // 会在结束编译时触发
        }
    }
    // 4.执行Compiler对象的run方法，开始编译
    run(callback) {
        this.hooks.run.call(); // 触发run事件（开始编译）
        // 5.根据配置中的entry找出入口文件
        this.compile((err, stats) => {
            // 10.在确定好输出内容后，根据配置的确定输出的路径和文件名，把文件内容写入到文件系统中
            for(let filename in stats.assets){
                let filepath  = path.join(this.options.output.path, filename);
                fs.writeFileSync(filepath, stats.assets[filename], 'utf-8')
            }

            callback(err, {
                toJson: () => stats
            })
        });
        this.hooks.done.call();
    }
    compile(callback) {
        // 每次编译都会创建一个新的Complication
        let complication = new Complication(this.options);
        complication.build(callback);
    }
}
module.exports = Compiler;