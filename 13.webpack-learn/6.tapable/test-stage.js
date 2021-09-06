let { SyncHook } = require('./tapable');
let hook = new SyncHook(["name"]);
hook.tap({ name: 'tap1', stage: 1 }, (name) => {
    console.log(1, name);
});
hook.tap({ name: 'tap3', stage: 3 }, (name) => {
    console.log(3, name);
});
hook.tap({ name: 'tap5', stage: 5 }, (name) => {
    console.log(5, name);
});
hook.tap({ name: 'tap2', stage: 2 }, (name) => {
    console.log(2, name);
});
hook.tap({ name: 'tap4' }, (name) => {
    console.log(4, name);
});
// 按以前的写法，是按照注册的顺序执行的；加了stage之后，就按照stage值增序执行 ~
hook.call('zhufeng');