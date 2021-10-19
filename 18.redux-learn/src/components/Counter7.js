import React from "react";
import { useDispatch, useSelector } from "../react-redux";
import actions from '../store/actionCreators/counter5';

function Counter7(props) {
    console.log('Counter7 render');
    //useSelector用于替换connect mapStateToProps
    let { number } = useSelector(state => state.counter5);
    let dispatch = useDispatch(); //store.dispatch
    return (
        <div>
            <p>{number}</p>
            <button onClick={() => dispatch(actions.add5())}>+</button>
            <button onClick={() => dispatch(actions.minus5())}>-</button>
            <button onClick={
                () => {
                    setTimeout(() => dispatch(actions.add5()), 1000);
                }
            }>1秒后加1</button>
        </div>
    )
}
export default Counter7;
