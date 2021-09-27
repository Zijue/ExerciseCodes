import React from './react';
import ReactDOM from './react-dom';

/**
 * 函数组件就是一个普通的函数
 * 1.接收一个props属性对象作为参数，并返回一个且仅能返回一个React元素（vdom）
 * 2.组件名称必须首字母大写，React通过首字母是否大写来判断是否是原生组件；span、div、p是小写开头，自定义组件是大写开头
 * 3.组件需要先声明再使用
 * @param {*} props 
 * @returns 
 */
// function FunctionComponent(props) {
//   return <h1 className="title" style={{ color: "red" }}>hello</h1>;
// }
// let reactElement = <FunctionComponent username='zijue'/>
// console.log(JSON.stringify(reactElement, null, 2));
// ReactDOM.render(reactElement, document.getElementById('root'));


// let reactElement = React.createElement('h1', {
//   className: 'title',
//   style: {
//     color: 'red'
//   }
// }, 'hello', React.createElement('span', null, 'world'));
let reactElement = <h1 className="title" style={{ color: "red" }}>hello</h1>; 
console.log(JSON.stringify(reactElement, null, 2));
ReactDOM.render(reactElement, document.getElementById('root'));
/**
 * TypeError: Cannot add property dom, object is not extensible
 * 源码的编译方法将vdom变成了不可扩展的对象 -- 缓存问题
 */