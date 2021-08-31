// 异步加载的实现原理
let sayHello = document.getElementById('say');
sayHello.addEventListener('click', () => {
    import('./hello').then(result => {
        console.log(result.default);
    })
});
// 一旦出现了import，那么被import的模块和它依赖的模块就会分割出去生成一个新的代码块
