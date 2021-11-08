import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';
import { combineReducers, createStore } from "redux";

export { connect };
function dva() {
    const app = {
        _models: [],
        model,
        _router: null,
        router,
        start,
        createAction,
    }
    function createAction() { //dva并没有此功能
        let actionCreators = {};
        for (const model of app._models) {
            let { reducers } = model;
            for (let key in reducers) {
                // counter/add => action {type: 'counter/add'}
                actionCreators[key] = () => ({ type: key });
            }
        }
        return actionCreators;
    }
    function model(modelConfig) {
        //需要给reducers添加namespace前缀
        let prefixedModel = prefixNamespace(modelConfig);
        app._models.push(prefixedModel);
    }
    function router(routerConfig) {
        app._router = routerConfig;
    }
    function start(root) {
        let reducers = {};
        //处理_models，生成reducers
        for (const model of app._models) {
            let reducer = getReducer(model);
            reducers[model.namespace] = reducer;
        }
        //把reducers合并成一个根reducer
        let combineReducer = combineReducers(reducers);
        let store = createStore(combineReducer);
        console.log(store.getState());
        ReactDOM.render(
            <Provider store={store}>
                {app._router()}
            </Provider>, document.querySelector(root));
    }
    return app;
}
function prefix(obj, namespace) {
    let newObj = {};
    for (let key in obj) {
        newObj[`${namespace}/${key}`] = obj[key];
    }
    return newObj;
}
function prefixNamespace(model) {
    if (model.reducers) {
        model.reducers = prefix(model.reducers, model.namespace);
    }
    return model;
}
//将model里的reducers对象转成一个reducer函数
function getReducer(model) {
    const { state: initialState, reducers } = model;
    let reducer = (state = initialState, action) => {
        let reducer = reducers[action.type];
        if (reducer) {
            return reducer(state, action);
        }
        return state;
    }
    return reducer;
}
export default dva;