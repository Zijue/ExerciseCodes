import * as effectTypes from './effectTypes';

function runSaga(env, saga) {
    let { channel, dispatch } = env;
    //saga可能是一个生成器函数，执行它得到迭代器；也可能就是一个迭代器，就直接使用此迭代器
    let it = typeof saga === 'function' ? saga() : saga;
    function next(value, isError) {
        let result;
        if (isError) {
            result = it.throw(value);
        } else {
            result = it.next(value);
        }
        let { value: effect, done } = result;
        if (!done) {
            if (typeof effect[Symbol.iterator] === 'function') {
                runSaga(env, effect); //如果发现产出的是一个迭代器，那就会运行这个迭代器
                next(); //运行的时候不会阻塞当前的saga，当前的saga会继续向下执行
            } else if (effect instanceof Promise) {
                //typeof effect.then === 'function'更加通用
                effect.then(next);
            } else {
                switch (effect.type) {
                    case effectTypes.TAKE:
                        //如果effect类型是TAKE，则会暂停当前saga的执行，等待某个动作类型的派发，
                        //等到之后才会继续向下执行saga
                        channel.once(effect.actionType, next);
                        break;
                    case effectTypes.PUT:
                        //如果effect的类型是PUT的话，则需要向仓库派发这个动作
                        dispatch(effect.action); //这个dispatch就是中间件最后返回的那个
                        //然后当前的saga可以继续向下执行
                        next();
                        break;
                    case effectTypes.FORK:
                        runSaga(env, effect.saga);
                        next(); //当前的saga可以继续向下执行
                        break;
                    case effectTypes.CALL:
                        effect.fn(...effect.args).then(next);
                        break;
                    case effectTypes.CPS:
                        effect.fn(...effect.args, (error, data) => {
                            if (error) {
                                next(error, true);
                            } else {
                                next(data);
                            }
                        })
                        break;
                    default:
                        break;
                }
            }
        }
    }
    next();
}
export default runSaga;