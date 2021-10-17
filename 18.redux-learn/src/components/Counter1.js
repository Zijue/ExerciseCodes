import React, { Component } from "react";
import { createStore } from 'redux';

const ADD = 'ADD';
const MINUS = 'MINUS';
let initState = { number: 0 };
/**
 * 根据老状态和新动作计算新状态
 * @param {*} state 老状态，可以是任意的值
 * @param {*} action 动作，必须是一个对象，且此对象必须得有一个type属性，用来唯一区分一个动作
 */
function reducer(state = initState, action) {
    switch (action.type) {
        case ADD:
            return { number: state.number + 1 };
        case MINUS:
            return { number: state.number - 1 };
        default:
            return state; //如果给的动作action.type不能被识别，直接返回上一个老状态
    }
}
let store = createStore(reducer, initState);
export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
    }
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={() => store.dispatch({ type: ADD })}>+</button>
                <button onClick={() => store.dispatch({ type: MINUS })}>-</button>
                <button onClick={
                    () => {
                        setTimeout(() => {
                            store.dispatch({ type: 'ADD' });
                        }, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}
/**
 * store 跟 组件交互有两个方向
 * 输入：把store中的属性输出给组件，让组件用来渲染
 * 输出：在组件里可以通过派发（dispatch）动作（action）修改状态，状态一更改，就马上通知订阅函数
 * 订阅函数里会调用组件的setState方法进行刷新
 */