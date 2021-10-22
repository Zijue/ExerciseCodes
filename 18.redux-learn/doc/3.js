//函数的组合

function add1(str) {
    return '1' + str;
}
function add2(str) {
    return '2' + str;
}
function add3(str) {
    return '3' + str;
}
/**
 * 把多个函数组合成一个函数
 * @param  {...any} funcs 
 * @returns 
 */
function compose(...funcs) {
    return function (args) {
        for (let i = funcs.length - 1; i >= 0; i--) {
            args = funcs[i](args);
        }
        return args
    }
}
let composeFn = compose(add3, add2, add1); //add1 => add2 => add3
let result = composeFn('xiaochi');
console.log(result);