import React from 'react';
import dva, { connect } from './dva';
import { Route, Link, routerRedux } from './dva/router';
import { createBrowserHistory } from 'history';
import { push, ConnectedRouter } from 'connected-react-router';

// const { push, ConnectedRouter } = routerRedux;
const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});
const app = dva({
  // history: createBrowserHistory()
});
app.model({
  namespace: 'counter', //因为一个dvaApp里可以定义很多的模型
  state: { number: 0 }, //每个model里可以定义一个状态
  reducers: {
    add(state) {
      return { number: state.number + 1 };
    },
    minus(state) {
      return { number: state.number - 1 };
    },
    asyncAdd(state) {
      console.log('reducers asyncAdd');
      return state;
    }
  },
  effects: {
    //store.dispatch(action)  redux-saga/effects
    //核心实现：等待counter/asyncAdd派发后会执行此saga
    // yield takeEvery('counter/asyncAdd', *asyncAdd);
    *asyncAdd(action, { call, put }) { //workerSaga
      console.log('effects asyncAdd');
      yield call(delay, 1000);
      //Warning: [sagaEffects.put] counter/add should not be prefixed with namespace counter
      //如果你在effects里通过put这个effect向仓库派发动作的话，是不需要加命名空间前缀的
      //如果不写前缀{type: 'add'}，就指的是向自己的命名空间下发送动作，等同于{type: 'counter/add'}
      yield put({ type: 'counter/add' }); //向仓库派发动作{type: 'counter/add'}
    },
    *goto(action, { put }) {
      let { payload: { path } } = action;
      yield put(push(path));
    }
  }
});
function Counter(props) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({ type: 'counter/asyncAdd' })}>asyncAdd</button>
      <button onClick={() => props.dispatch({ type: 'counter/goto', payload: { path: '/' } })}>跳转到/</button>
    </div>
  )
}
//store.getState() => { counter: { number: 0 } }
const mapStateToProps = state => state.counter;
//connect中不传入actionCreators，会绑定store.dispatch方法
const ConnentedCounter = connect(mapStateToProps)(Counter);
//指定要渲染的内容
const Home = () => <div>Home</div>
app.router(
  (api) => (
    <ConnectedRouter history={api.history}>
      <>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/counter'>Counter</Link></li>
        </ul>
        <Route path='/' exact={true} component={Home} />
        <Route path='/counter' component={ConnentedCounter} />
      </>
    </ConnectedRouter>
  )
)
//开始渲染
app.start('#root'); //ReactDOM.render(() => <ConnectedCounter />, '#root')