//原生的store.dispatch方法只能接受一个纯对象参数，不能是函数
//如何判断是不是纯对象呢？通过下面的方式，看对象的原型是否指向Object.prototype
let obj1 = { type: 'add' };
console.log(Object.getPrototypeOf(obj1) === Object.prototype);
console.log(Object.getPrototypeOf(function () { }) === Object.prototype);
console.log(Object.getPrototypeOf(new Promise((resolve, reject) => resolve('ok'))) === Object.prototype);