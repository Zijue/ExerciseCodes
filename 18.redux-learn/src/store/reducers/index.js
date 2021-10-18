import { combineReducers } from '../../redux';
import { default as counter3 } from './counter3';
import { default as counter4 } from './counter4';

//combineReducers可以把多个reducer函数组件的对象合并成一个reducer；
//合成之后会返回一个整的reducer，整的reducer里面会包含一个整的state
let rootReducer = combineReducers({
    counter3, //每个reducer都有自己的状态，都有自己的能响应的动作
    counter4
});
export default rootReducer;