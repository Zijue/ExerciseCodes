function applyMiddleware(logger) {
    return function (createStore) {
        return function (reducer, preloadedState) {
            let store = createStore(reducer, preloadedState);
            let dispatch; //它会指向改造后的dispatch，这时还是undefined。这样处理的目的，可以参考doc/1.js
            let middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => dispatch(action)
            }

            return {
                ...store,
                dispatch
            }
        }
    }
}
export default applyMiddleware;