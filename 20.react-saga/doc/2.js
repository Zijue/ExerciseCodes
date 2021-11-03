function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
let it = gen();
//1.如何判断一个对象是不是迭代器；迭代器对象的Symbol.iterator是一个函数
console.log(it[Symbol.iterator]);
let r1 = it.next();
console.log(r1);
// let r2 = it.throw();
let r2 = it.return(); //一旦调用return，迭代器就直接返回了
console.log(r2);
let r3 = it.next();
console.log(r3);