const { SyncLoopHook } = require("tapable");
//当回调函数返回非undefined值的时候会停止调用后续的回调

let hook = new SyncLoopHook(["name", "age"]);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
hook.tap("1", (name, age) => {
    console.log(1, "counter1", counter1);
    if (++counter1 == 1) {
        counter1 = 0;
        return;
    }
    return true;
});
hook.tap("2", (name, age) => {
    console.log(2, "counter2", counter2);
    if (++counter2 == 2) {
        counter2 = 0;
        return;
    }
    return true;
});
hook.tap("3", (name, age) => {
    console.log(3, "counter3", counter3);
    if (++counter3 == 3) {
        counter3 = 0;
        return;
    }
    return true;
});
hook.call("zhufeng", 10);
/** 一共15次，每次要进入tap3，之前的就需要执行4次
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 0

1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 1

1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 2
 */