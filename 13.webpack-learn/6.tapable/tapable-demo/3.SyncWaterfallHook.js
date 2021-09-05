const { SyncWaterfallHook } = require("tapable");

const hook = new SyncWaterfallHook(["name", "age"]);
hook.tap("1", (name, age) => {
    console.log(1, name, age);
    return 1;
});
hook.tap("2", (name, age) => {
    console.log(2, name, age);
    return;
});
hook.tap("3", (name, age) => {
    console.log(3, name, age);
    return 3;
});

hook.call("zhufeng", 10);
/**
1 zhufeng 10
2 1 10
3 1 10
 */