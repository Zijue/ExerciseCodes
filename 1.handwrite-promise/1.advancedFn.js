function coreFn(a, b, c) {
    // 实现了核心逻辑 
    console.log('core fn', a, b, c)
}

Function.prototype.before = function (beforeFn) {
    return (...args) => {
        beforeFn();
        this(...args); // this => coreFn
    }
}

let newFn = coreFn.before(() => {
    console.log('before fn')
});

newFn(1, 2, 3);
