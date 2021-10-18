import * as types from '../action-types';

let initialState = { number: 0 };
export default function counter5Reducer(state = initialState, action) {
    switch (action.type) {
        case types.ADD5:
            return { number: state.number + 1 };
        case types.MINUS5:
            return { number: state.number - 1 };
        default:
            return state;
    }
}