function logger({ getState, dispatch }) {
    return function (next) { //为了实现中间件的级联，调用下一个中间件
        return function (action) { //改造后的dispatch方法
            console.log("prev state", getState());
            next(action); //如果只有一个中间件，next就是原始的store.dispatch
            console.log("next state", getState());
            return action;
        }
    }
}
export default logger;