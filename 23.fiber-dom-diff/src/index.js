import React from './react';
import ReactDOM from './react-dom';
// ReactDOM.render(
//   <div key='title' id='title'>title</div>,
//   document.getElementById('root')
// );

//1.key相同，类型相同，复用老节点，只更新属性
single1.addEventListener('click', () => {
    let element = (
        <div key="title" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
single1Update.addEventListener('click', () => {
    let element = (
        <div key="title" id="title2">title2</div>
    );
    ReactDOM.render(element, root);
});