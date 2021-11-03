import { combineReducers } from 'redux';
import { connectRouter } from '../../connected-react-router';
import counter from './counter';
import history from '../../history';

let reducers = {
    router: connectRouter(history),
    counter
}
const combineReducer = combineReducers(reducers);
export default combineReducer;
/**
state = {
    router: {action: 'PUSH/POP', location: {pathname: '/counter'}},
    counter: {number: 0}
}
 */
/**
 * connectRouter(history)执行结果是一个reducer
 * ConnectedRouter监听路径变化，路径发生变化后发送动作给仓库
 * router会响应这个动作，并且把最新的路径保存到仓库中
 *
 * connected-react-router这个库四个文件，分两组
 * 每组完成一个功能
 * 1.把最新的路劲信息同步到仓库中
 * ConnectedRouter：监听路径变化，路由变化后向仓库派发动作
 * connectRouter：这个reducer会响应这个动作，把传递过来的路径信息写入仓库
 */