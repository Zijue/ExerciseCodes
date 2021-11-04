import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from '../redux-saga';
import rootSaga from './saga';
import combineReducers from './reducers';

const sagaMiddleware = createSagaMiddleware()
let store = applyMiddleware(sagaMiddleware)(createStore)(combineReducers);
sagaMiddleware.run(rootSaga);
export default store;