import compose from "./compose";

/**
 * 应用中间件的格式也是固定的，
 * 传入需要应用的中间件 -> 传入创建仓库的函数 -> 传入处理函数及状态初始值
 */
function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, preloadedState) {
            let store = createStore(reducer, preloadedState);
            let dispatch; //它会指向改造后的dispatch，这时还是undefined。这样处理的目的，可以参考doc/1.js
            let middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => dispatch(action)
            }
            // dispatch = middleware(middlewareAPI)(store.dispatch); //应用单个中间件的方法
            //级联中间件
            let chain = middlewares.map(middleware => middleware(middlewareAPI)); //1.获取中间件链，去掉第一层
            dispatch = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch
            }
        }
    }
}
export default applyMiddleware;