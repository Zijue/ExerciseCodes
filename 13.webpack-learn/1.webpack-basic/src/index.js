// let name = require('./name.txt');
// console.log(name.default);
// console.log('开发服务器不生成实际文件中的吗？')

import './index.css';
import './less.less';
import './sass.scss';

// let logo = require('../static/cyt.jpg');
// let img = new Image();
// // img.src = logo.default;
// img.src = logo; // esModule: false
// document.body.appendChild(img);

// function readonly(target, key, descriptor) {
//     descriptor.writable = false;
// }
// class Circle {
//     @readonly PI = 3.14; // 在jsconfig.json中启用装饰器的支持，不然此处会报错
// }
// let c1 = new Circle();
// c1.PI = 3.15;
// console.log(c1);

// 打包第三方类库，直接引入
// import _ from 'lodash';

// 入口模块内引入一次lodash，可以采用行内loader的方式，如下：
// require('expose-loader?exposes=_zj!lodash'); // _提示已经定义在了global上，不知道怎么处理；exposes=其他值就ok了
// console.log(_.join(['a', 'b', 'c'], '@'));
// console.log(window._);
// 假如，我们的模块很多，且都需要引入lodash模块，就会很麻烦，可以使用ProvidePlugin插件自动添加

// import jQuery from 'jquery';
// console.log(jQuery);

// fetch('/api/users').then((res) => res.json()).then(data => console.log(data));
