function combineReducers(reducers) {
    //合并后的reducer，合并后的函数
    return function rootReducer(state = {}, action) {
        let nextState = {};
        for (let key in reducers) {
            //根据每个子reducer的老的分状态和动作，计算每个reducer的新的分状态
            nextState[key] = reducers[key](state[key], action);
        }
        return nextState;
    }
}
export default combineReducers;
/**
let reducers = {
    counter3: counter3 reducer,
    counter4: counter4 reducer
}

===>

let combineState = {
    counter3: { number: 0 },
    counter4: { number: 0 }
}
 */
