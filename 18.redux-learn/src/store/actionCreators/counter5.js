import * as types from '../action-types';

const actionCreators = {
    add5() {
        return { type: types.ADD5 }
    },
    minus5() {
        return { type: types.MINUS5 }
    }
};
export default actionCreators;