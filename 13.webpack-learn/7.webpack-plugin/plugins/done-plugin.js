class DonePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        //同步
        compiler.hooks.done.tap('DonePlugin', (stats) => {
            console.log('sync-DonePlugin');
            // console.log(stats);
        });
        //异步
        compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => {
            console.log('async-DonePlugin');
            callback();
        });
        //promise
        compiler.hooks.done.tapPromise('DonePlugin', (stats) => {
            return new Promise((resolve) => {
                console.log('promise-DonePlugin');
                resolve();
            })
        });
    }
}
module.exports = DonePlugin;