/* eslint-disable require-yield */
import { put, take, cancel, fork } from '../redux-saga/effects';
import * as actionTypes from './action-types';

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}
function* add() {
    while (1) {
        yield delay(1000);
        yield put({ type: actionTypes.ADD });
    }
}
function* addWatcher() {
    const task = yield fork(add); //fork就是开启一个子saga
    console.log(task);
    yield take(actionTypes.STOP);
    yield cancel(task);
}
function* rootSaga() {
    yield addWatcher();
}
export default rootSaga;
/**
 * saga 分三种
 * worker saga 做具体的工作，如调用API，进行异步请求，获取异步封装结果
 * watcher saga 监听被dispatch的actions，当接受到action或者知道其被触发时，调用worker执行任务
 * root saga 立即启动saga的唯一入口
 */