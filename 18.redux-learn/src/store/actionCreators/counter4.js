import * as types from '../action-types';

const actionCreators = {
    add4() {
        return { type: types.ADD2 }
    },
    minus4() {
        return { type: types.MINUS2 }
    }
};
export default actionCreators;