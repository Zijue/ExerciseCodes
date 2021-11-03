export { default as ConnectedRouter } from './ConnectedRouter';
export { default as connectRouter } from './connectRouter';
export { push } from './actions';
export { default as routerMiddleware } from './routerMiddleware'
/**
 * push执行结果是一个action
 * routerMiddleware可以拦截这个action，并且判断是否要跳转路径，history.push(path)
 */