import React from "react";
import { /**useDispatch,*/ useSelector, useBoundDispatch } from "../react-redux";
import actions from '../store/actionCreators/counter6';

function Counter8(props) {
    console.log('Counter8 render');
    //useSelector用于替换connect mapStateToProps
    let { number } = useSelector(state => state.counter6);
    // let dispatch = useDispatch(); //store.dispatch
    let { add6, minus6 } = useBoundDispatch(actions);
    return (
        <div>
            <p>{number}</p>
            <button onClick={add6}>+</button>
            <button onClick={minus6}>-</button>
            <button onClick={
                () => {
                    setTimeout(add6, 1000);
                }
            }>1秒后加1</button>
        </div>
    )
}
export default Counter8;
