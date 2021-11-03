import * as actionTypes from '../action-types';

const actionCreators = {
    add() {
        return { type: actionTypes.ADD };
    },
    asyncAdd() {
        return { type: actionTypes.ASYNC_ADD };
    }
}
export default actionCreators;