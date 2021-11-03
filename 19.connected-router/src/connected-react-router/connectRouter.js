import { LOCATION_CHANGE } from './actions';

export default function connectRouter(history) {
    const initialState = { action: history.action, location: history.location };
    return function reducer(state = initialState, { type, payload } /**action */) {
        if (type === LOCATION_CHANGE) {
            return { ...state, action: payload.action, location: payload.location };
        }
        return state;
    }
}
