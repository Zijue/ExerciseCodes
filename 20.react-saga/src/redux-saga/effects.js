import * as effectTypes from './effectTypes';

export function take(actionType) {
    return { type: effectTypes.TAKE, actionType };
}
export function put(action) {
    return { type: effectTypes.PUT, action };
}
export function fork(saga, args) {
    return { type: effectTypes.FORK, saga, args };
}
export function takeEvery(actionType, saga) {
    //将原add的saga包装成一个新的状态机saga，返回的saga会直接执行一次，effect类型是FORK，
    //runSaga会执行takeEveryHelper，然后监听actionType动作，并阻塞，
    //等待动作派发后，会继续向下执行fork，同时当前的takeEveryHelper saga继续执行到take，继续监听
    function* takeEveryHelper() {
        while (1) { //状态机
            const action = yield take(actionType);
            yield fork(saga, [action]);
        }
    }
    return fork(takeEveryHelper);
}
export function call(fn, ...args) {
    return { type: effectTypes.CALL, fn, args };
}
export function cps(fn, ...args) {
    return { type: effectTypes.CPS, fn, args };
}
export function all(iterators) {
    return { type: effectTypes.ALL, iterators };
}
export function cancel(task) {
    return { type: effectTypes.CANCEL, task };
}