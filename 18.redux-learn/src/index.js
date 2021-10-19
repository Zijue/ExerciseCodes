import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './react-redux';
import store from './store';
import Counter7 from './components/Counter7';
import Counter8 from './components/Counter8';

//组合reducer实现不同组件共用同一个store，redux官方也是建议一个项目只有一个唯一的store
//使用react-redux的方式编写代码，可以使组件的编写变得十分简洁
ReactDOM.render((
    <Provider store={store}>
        <Counter7 />
        <hr />
        <Counter8 />
    </Provider>
), document.getElementById('root'));