/* eslint-disable require-yield */

function* rootSaga() {
    console.log('rootSaga');
}
export default rootSaga;
/**
 * saga 分三种
 * worker saga 做具体的工作，如调用API，进行异步请求，获取异步封装结果
 * watcher saga 监听被dispatch的actions，当接受到action或者知道其被触发时，调用worker执行任务
 * root saga 立即启动saga的唯一入口
 */