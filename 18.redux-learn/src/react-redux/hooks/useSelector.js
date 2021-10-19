import React from "react";
import ReactReduxContext from "../ReactReduxContext";
import shallowEqual from "../shallowEqual";

function useSelector(selector) {
    const { store } = React.useContext(ReactReduxContext);
    let state = store.getState(); //{counter5:{number:0},counter6:{number:0}}
    let lastSelectedState = React.useRef(); //用于记录上一次的state，当闭包变量使用，不指向任何dom
    let selectedState = selector(state); //{number:0}
    let [, forceUpdate] = React.useReducer(x => x + 1, 0);
    //使用useLayoutEffect是为了只调用一次subscribe
    React.useLayoutEffect(() => {
        store.subscribe(() => {
            //此处必须从新获取selectedState的值，不然就处于闭包
            let selectedState = selector(store.getState());
            if (!shallowEqual(selectedState, lastSelectedState.current)) {
                forceUpdate(); //forceUpdate就是useReducer返回的dispatch，调度组件更新的
            }
            lastSelectedState.current = selectedState;
        })
    }, [selector, store]);
    return selectedState;
}
export default useSelector;