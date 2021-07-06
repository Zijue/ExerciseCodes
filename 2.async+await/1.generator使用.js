// function* gen(x) {
//     const y = yield x + 2;
//     return y;
// }

// let it = gen(1);
// console.log(it.next());
// console.log(it.next());


// function* gen(x) {
//     const y = yield x + 2;
//     return y;
// }

// let it = gen(1);
// console.log(it.next());
// console.log(it.next('输入值'));


// function* gen(x) {
//     try {
//         let y = yield x + 2;
//         return y;
//     } catch (e) {
//         console.log(e);
//     }
// }

// let it = gen(1);
// console.log(it.next());
// console.log(it.throw('出错了'));


function* read() {
    const a = yield 1;
    const b = yield 2;
    return b;
}
