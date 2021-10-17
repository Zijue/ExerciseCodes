/**
 * 创建store
 * @param {*} reducer 
 * @param {*} preloadState 传递的初始值
 * 传递初始值有两种方式，一种是reducer initialState，另一种createStore preloadState
 * 优先级：preloadState > initialState
 */
function createStore(reducer, preloadState) {
    let state = preloadState;
    let listeners = [];
    function getState() {
        return state;
    }
    function dispatch(action) {
        //根据老状态和action.type计算新状态
        state = reducer(state, action);
        //然后要通知所有的订阅函数执行
        listeners.forEach(listener => listener());
    }
    function subscribe(listener) {
        listeners.push(listener);
        //返回一个取消订阅的函数，将订阅函数从listeners数组中剔除
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    }
    //type只要是reducer中不存在的任意值都可以，主要是为了确定state的值
    dispatch({ type: '@@/REDUX_INIT' });
    return {
        getState,
        dispatch,
        subscribe
    }
}
export default createStore;