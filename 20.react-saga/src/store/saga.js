/* eslint-disable require-yield */
import { put, fork, takeEvery } from '../redux-saga/effects';
import * as actionTypes from './action-types';

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}
function* add() {
    // console.log('add 1');
    yield delay(1000);
    // console.log('add 2');
    yield put({ type: actionTypes.ADD });
}
function* rootSaga() {
    // yield fork(add);
    // console.log('rootSaga fork');
    
    //监听每一次的ASYNC_ADD动作派发，执行对应的saga
    yield takeEvery(actionTypes.ASYNC_ADD, add);
}
export default rootSaga;
/**
 * saga 分三种
 * worker saga 做具体的工作，如调用API，进行异步请求，获取异步封装结果
 * watcher saga 监听被dispatch的actions，当接受到action或者知道其被触发时，调用worker执行任务
 * root saga 立即启动saga的唯一入口
 */