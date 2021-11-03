import { push } from '../../connected-react-router';
import * as actionTypes from '../action-types';

const actionCreators = {
    add() {
        return { type: actionTypes.ADD };
    },
    minus() {
        return { type: actionTypes.MINUS };
    },
    goto(path) {
        //push本质上是一个actionCreator
        //仓库store里有一个中间件，可以拦截这种action，然后进行路径的跳转
        return push(path);
    }
}
export default actionCreators;