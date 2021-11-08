import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';

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
        let combinedReducer = combineReducers(reducers);
        //从app中获取saga的数组
        const sagas = getSagas(app);
        let sagaMiddleware = createSagaMiddleware();
        // let store = createStore(combinedReducer);
        let store = applyMiddleware(sagaMiddleware)(createStore)(combinedReducer);
        window.store = store; //用于开发调试
        //启动全部的saga
        sagas.forEach(saga => sagaMiddleware.run(saga));
        ReactDOM.render(
            <Provider store={store}>
                {app._router()}
            </Provider>, document.querySelector(root));
    }
    return app;
}
// function prefixType(type, namespace) {
//     if (type.indexOf('/') === -1) { //如果没有命名空间，就加上自己的命名空间前缀
//         return namespace + '/' + type;
//     } else if (type.split('/')[0] === namespace) {
//         console.warn(`Warning: [sagaEffects.put] ${type} should not be prefixed with namespace ${namespace}`);
//     }
//     return type;
// }
function createWatcherSaga(key, effect, model) {
    return function* () {
        yield sagaEffects.takeEvery(key, function* (action) {
            yield effect(action, sagaEffects);
        });
    }
}
function getSaga(model) {
    const { effects } = model;
    return function* () {
        debugger
        for (const key in effects) { //key=asyncAdd
            const watcherSaga = createWatcherSaga(key, effects[key], model);
            yield sagaEffects.fork(watcherSaga);
        }
    }
}
function getSagas(app) {
    let sagas = [];
    for (let model of app._models) {
        let saga = getSaga(model);
        sagas.push(saga);
    }
    return sagas;
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
    if (model.effects) {
        model.effects = prefix(model.effects, model.namespace);
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