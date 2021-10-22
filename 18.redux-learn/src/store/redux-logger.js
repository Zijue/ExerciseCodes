/**
 * 不管是什么中间件，不管是什么逻辑，它的基本架构都是一样的
 * getState 获取仓库的状态
 * dispatch 重新派发动作
 * next 调用下一个中间件或者原始的store.dispatch
 */
//中间件中的middlewareAPI.dispatch是改造后的dispatch，即logger函数传入的dispatch参数。
//这样做的目的是，有些时候我们希望能够嵌套或者重新派发
function logger({ getState, dispatch }) { //这里的dispatch是改造后的
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