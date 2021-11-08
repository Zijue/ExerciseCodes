import React from 'react';
import dva, { connect } from './dva';

const app = dva();
app.model({
  namespace: 'counter', //因为一个dvaApp里可以定义很多的模型
  state: { number: 0 }, //每个model里可以定义一个状态
  reducers: {
    add(state) {
      return { number: state.number + 1 };
    },
    minus(state) {
      return { number: state.number - 1 };
    }
  }
});
/**
const actionCreators = {
  add() {
    return { type: 'counter/add' };
  },
  minus() {
    return { type: 'counter/minus' };
  }
};
 */
const actionCreators = app.createAction();
console.log(actionCreators);
function Counter(props) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={props['counter/add']}>+</button>
      <button onClick={props['counter/minus']}>-</button>
      {/* <button onClick={() => props.dispatch({ type: 'counter/add' })}>+</button>
      <button onClick={() => props.dispatch({ type: 'counter/minus' })}>-</button> */}
    </div>
  )
}
//store.getState() => { counter: { number: 0 } }
const mapStateToProps = state => state.counter;
//connect中不传入actionCreators，会绑定store.dispatch方法
const ConnentedCounter = connect(mapStateToProps, actionCreators)(Counter);
//指定要渲染的内容
app.router(() => <ConnentedCounter />)
//开始渲染
app.start('#root'); //ReactDOM.render(() => <ConnectedCounter />, '#root')