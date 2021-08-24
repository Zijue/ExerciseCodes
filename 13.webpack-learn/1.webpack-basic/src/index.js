// let name = require('./name.txt');
// console.log(name.default);
// console.log('开发服务器不生成实际文件中的吗？')

// import './index.css';
// import './less.less';
// import './sass.scss';

// let logo = require('../static/cyt.jpg');
// let img = new Image();
// // img.src = logo.default;
// img.src = logo; // esModule: false
// document.body.appendChild(img);

function readonly(target, key, descriptor) {
    descriptor.writable = false;
}
class Circle {
    @readonly PI = 3.14; // 在jsconfig.json中启用装饰器的支持，不然此处会报错
}
let c1 = new Circle();
c1.PI = 3.15;
console.log(c1);