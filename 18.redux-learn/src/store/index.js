import { createStore } from '../redux';
import combineReducer from './reducers';

const store = createStore(combineReducer);
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
export default store;