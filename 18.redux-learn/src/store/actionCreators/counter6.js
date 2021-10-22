import * as types from '../action-types';

const actionCreators = {
    add6() {
        return { type: types.ADD6 }
    },
    minus6() {
        return { type: types.MINUS6 }
    },
    thunkAdd() {
        return function (dispatch, getState) {
            setTimeout(() => {
                dispatch({ type: types.ADD6 })
            }, 2000);
        }
    },
    promiseAdd() {
        //promise中间件有两种方式，第一种是派发一个Promise，如下，
        //直接派发的方式只能处理成功的情况
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ type: types.ADD6 })
            }, 2000);
        })
    },
    promiseAdd2() {
        return {
            type: types.ADD6,
            payload: new Promise((resolve, reject) => {
                setTimeout(() => {
                    let result = Math.floor(Math.random() * 10);
                    console.log('result', result);
                    if (result > 5) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }, 2000);
            })
        }
    }
};
export default actionCreators;