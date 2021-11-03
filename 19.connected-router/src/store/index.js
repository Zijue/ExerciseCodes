import { createStore, applyMiddleware } from "redux";
import { routerMiddleware } from '../connected-react-router';
import history from "../history";
import combineReducers from "./reducers";

const store = applyMiddleware(routerMiddleware(history))(createStore)(combineReducers);
// const store = createStore(combineReducers);
window.store = store; //便于在浏览器中查看store信息，学习用
export default store;
