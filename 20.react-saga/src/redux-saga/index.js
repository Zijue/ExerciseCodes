import runSaga from './runSaga';
import createChannel from './createChannel';

function createSagaMiddleware() {
    let channel = createChannel();
    let boundRunSaga;
    function sagaMiddleware({ getState, dispatch }) {
        boundRunSaga = runSaga.bind(null, { channel, dispatch }); //绑定第一个参数
        return function (next) {
            return function (action) {
                let result = next(action);
                channel.emit(action)
                return result;
            }
        }
    }
    sagaMiddleware.run = (saga) => boundRunSaga(saga);
    return sagaMiddleware;
}
export default createSagaMiddleware;