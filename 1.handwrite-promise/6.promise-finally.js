Promise.prototype.finally = function (cb) {
    return this.then((y) => {
        return Promise.resolve(cb()).then((d) => y);
    }, (r) => {
        // cb执行一旦报错 就直接跳过后续的then的逻辑，直接将错误向下传递
        return Promise.resolve(cb()).then(() => { throw r })
    })
}

Promise.reject('ok').finally(() => { // finally 如果返回的是一个promise那么会有等待效果
    // throw TypeError('执行错误')
    console.log('无论成功失败都执行')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('xxxxxxxxxxx'); // 如果是失败 会用这里的失败作为失败的原因
        }, 1000);
    });
}).then((data) => {
    console.log('成功', data)
}).catch(err => {
    console.log('失败', err)
});