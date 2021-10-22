import { createStore, applyMiddleware } from '../redux';
import combineReducer from './reducers';
import logger from './redux-logger';
import thunk from './redux-thunk';
import promise from './redux-promise';

// const store = createStore(combineReducer);
//实现日志的功能，通过AOP的方式
// let originDispatch = store.dispatch;
// store.dispatch = function (action) {
//     /**同步
//         console.log("prev state", store.getState());
//         originDispatch(action);
//         console.log("next state", store.getState());
//      */
//     console.log("prev state", store.getState());
//     setTimeout(() => {
//         originDispatch(action);
//         console.log("next state", store.getState());
//     }, 1000);
//     return action;
// }

//应用中间件 -- 中间件的级联
const store = applyMiddleware(promise, thunk, logger)(createStore)(combineReducer);
export default store;