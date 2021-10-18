import * as types from '../action-types';

let initialState = { number: 0 };
export default function counter6Reducer(state = initialState, action) {
    switch (action.type) {
        case types.ADD6:
            return { number: state.number + 1 };
        case types.MINUS6:
            return { number: state.number - 1 };
        default:
            return state;
    }
}