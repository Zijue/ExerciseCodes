import { createStore } from './redux';

let counterValue = document.getElementById('counter-value');
let addBtn = document.getElementById('add-btn');
let minusBtn = document.getElementById('minus-btn');

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
let store = createStore(reducer, { number: 0 });
function render() {
  counterValue.innerHTML = store.getState().number + '';
}
render();
let unsubscribe = store.subscribe(render);
setTimeout(() => {
  unsubscribe();
}, 3000);
addBtn.addEventListener('click', () => {
  store.dispatch({ type: ADD });
});
minusBtn.addEventListener('click', () => {
  store.dispatch({ type: MINUS });
})