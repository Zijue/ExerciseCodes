/* eslint-disable require-yield */
import { put, take } from 'redux-saga/effects';
import * as actionTypes from './action-types';

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}
function* workerSaga() {
    //告诉saga中间件，请帮我向仓库派发一个action {type: actionTypes.ADD}
    yield delay(1000);
    yield put({ type: actionTypes.ADD });
}
/**
 * watcherSaga是用来监听向仓库派发的对象的，如果有人向仓库派发关心的对象，则会调用对应的workerSaga
 */
function* watcherSaga() {
    //监听有人向仓库派发的ASYNC_ADD的动作，如果没有等到，此SAGA会卡这里或者说暂停在这里，
    //如果有人向仓库派发，会继续向下执行
    yield take(actionTypes.ASYNC_ADD); //take只会监听一次，如果监听到了，执行后续代码；以后再派发，不再响应
    yield workerSaga();
    console.log('watcherSaga结束')
}
function* rootSaga() {
    yield watcherSaga();
    console.log('rootSaga结束')
}
export default rootSaga;
/**
 * saga 分三种
 * worker saga 做具体的工作，如调用API，进行异步请求，获取异步封装结果
 * watcher saga 监听被dispatch的actions，当接受到action或者知道其被触发时，调用worker执行任务
 * root saga 立即启动saga的唯一入口
 */