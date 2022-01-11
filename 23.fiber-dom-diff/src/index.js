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

//2.key相同，类型不同，删除老节点，添加新节点
single2.addEventListener('click', () => {
    let element = (
        <div key="title" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
single2Update.addEventListener('click', () => {
    let element = (
        <p key="title" id="title">title</p>
    );
    ReactDOM.render(element, root);
});

//3.类型相同，key不同，删除老节点，添加新节点
single3.addEventListener('click', () => {
    let element = (
        <div key="title1" id="title">title</div>
    );
    ReactDOM.render(element, root);
});
single3Update.addEventListener('click', () => {
    let element = (
        <div key="title2" id="title">title</div>
    );
    ReactDOM.render(element, root);
});

//4.原来多个节点，现在只有一个节点，删除多余节点
single4.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="A">A</li>
            <li key="B" id="B">B</li>
            <li key="C">C</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
single4Update.addEventListener('click', () => {
    let element = (
        <ul key="ul">
            <li key="B" id="B2">B2</li>
        </ul>
    );
    ReactDOM.render(element, root);
});
