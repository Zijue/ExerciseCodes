/**
 * saga 采用Generator生成器函数来yield Effects（包含指令的文本对象）
 * 
 * 为什么选择使用Generator
 * Generator函数的作用是可以暂停执行，再次执行的时候从上次暂停的地方继续执行
 * Effect是一个简单的JS对象，该对象包含了一些给middleware解释执行的信息
 */
function* gen() {
    yield { type: 'PUT', action: { type: 'ADD' } }; //指令对象 PUT 向仓库派发一个动作{type: 'ADD'}
    yield new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok')
        }, 2000);
    });
    yield { type: 'PUT', action: { type: 'MINUS' } };
}
//saga的本质原理就是run函数，它可以自动把生成器函数执行完毕。类似于co库
function run(gen) {
    let it = gen();
    function next() {
        let { value: effect, done } = it.next();
        if (!done) {
            if (effect instanceof Promise) {
                effect.then(() => {
                    next();
                })
            } else if (effect.type === 'PUT') {
                console.log('如果type=PUT，就需要向仓库派发动作', effect.action); //store.dispatch(action)
                next();
            }
        }
    }
    next();
}
run(gen);