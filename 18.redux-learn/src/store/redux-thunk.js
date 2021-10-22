function thunk({ getState, dispatch }) { //这里的dispatch是改造后的
    return function (next) { //为了实现中间件的级联，调用下一个中间件
        return function (action) { //改造后的dispatch方法
            if (typeof action === 'function') {
                //执行此函数，并且传入dispatch和getState
                return action(dispatch, getState);
            }
            next(action); //执行原始的store.dispatch方法
            return action;
        }
    }
}
export default thunk;