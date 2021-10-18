import React from 'react';
import ReactDOM from 'react-dom';
import Counter3 from './components/Counter3';
import Counter4 from './components/Counter4';

//组合reducer实现不同组件共用同一个store，redux官方也是建议一个项目只有一个唯一的store
ReactDOM.render((
    <div>
        <Counter3 />
        <Counter4 />
    </div>
), document.getElementById('root'));