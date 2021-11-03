import { CALL_HISTORY_METHOD } from './actions';

export default function routerMiddleware(history) {
    return function ({ getState, dispatch }) {
        return function (next) {
            return function (action) {
                const { type, payload } = action;
                if (type === CALL_HISTORY_METHOD) {
                    history[payload.method](payload.path);
                } else {
                    return next(action);
                }
            }
        }
    }
}
