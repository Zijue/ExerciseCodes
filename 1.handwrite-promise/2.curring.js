// typeof > Array.isArray > Object.prototype.toString.call > instanceof > constructor

function isType(type, val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`
}

// function isType(type) {
//     return function (val) {
//         return Object.prototype.toString.call(val) === `[object ${type}]`
//     }
// }

function curring(fn) {
    let args = []; // 记录每次调用传入的参数个数
    const inner = (arr = []) => {
        args.push(...arr);
        /** 对比函数的参数个数与已传入的参数个数进行对比
         * 如果传入的参数个数 大于或等于 函数的参数个数 ==> 执行函数
         * 否则，返回包裹 inner 的箭头函数（递归调用）
         */
        return args.length >= fn.length ? fn(...args) : (...args) => inner(args);
    }
    return inner();
}

let isString = curring(isType)('String');
let isNumber = curring(isType)('Number')
let isBoolean = curring(isType)('Boolean');

console.log(isString(123));
console.log(isNumber(456));
console.log(isBoolean(123));


function sum(a, b, c, d) {
    return a + b + c + d;
}

let fn = curring(sum);
let fn1 = fn(1);
let fn2 = fn1(2, 3);
let result = fn2(4);
console.log(result);
