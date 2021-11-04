function createChannel() {
    let listeners = [];
    function once(actionType, listener) {
        listener.actionType = actionType;
        listener.cancel = () => listeners = listeners.filter(item => item !== listener);
        listeners.push(listener);
    }
    function emit(action) {
        listeners.forEach(listener => {
            if (listener.actionType === action.type) {
                listener.cancel(); //先取消监听
                listener(action); //然后再执行，listener就是runSaga中的next方法
            }
        })
    }
    return { once, emit }
}
export default createChannel;