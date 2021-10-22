function promise({ getState, dispatch }) { //这里的dispatch是改造后的
    return function (next) { //为了实现中间件的级联，调用下一个中间件
        return function (action) { //改造后的dispatch方法
            if (action.then && typeof action.then === 'function') {
                //执行此函数，并且传入dispatch和getState
                return action.then(dispatch);
            } else if (action.payload && action.payload.then && typeof action.payload.then === 'function') {
                action.payload
                    .then(payload => dispatch({ ...action, payload })) //{type:'ADD6',payload: [Int]}
                    .catch(error => { //error [Int]
                        //在reducer里可以通过action里有没有error:true属性来判断是成功了还是失败了
                        dispatch({ ...action, payload: error, error: true });
                        return Promise.reject(error);
                    })
            } else {
                next(action); //执行原始的store.dispatch方法
                return action;
            }
        }
    }
}
export default promise;