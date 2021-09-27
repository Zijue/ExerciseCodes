import React from './react';
import ReactDOM from './react-dom';

// let reactElement = <h1 className="title" style={{ color: "red" }}>hello</h1>; //babel会先编译
//变成下面这种形式
/*
React.createElement('h1', {
  className: 'title',
  style: {
    color: 'red'
  }
}, 'hello');
 */
let reactElement = React.createElement('h1', {
  className: 'title',
  style: {
    color: 'red'
  }
}, 'hello', React.createElement('span', null, 'world'));
console.log(JSON.stringify(reactElement, null, 2));
/* vdom
{
  "type": "h1",
  "key": null,
  "ref": null,
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": "hello"
  },
  "_owner": null,
  "_store": {}
}
 */
ReactDOM.render(reactElement, document.getElementById('root'));
