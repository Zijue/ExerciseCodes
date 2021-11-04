export const TAKE = 'TAKE'; //监听某个动作
export const PUT = 'PUT'; //派发某个动作
export const FORK = 'FORK'; //用来产出一个新的任务
//告诉中间件，请帮我调用一个方法，此方法一定会返回一个promise，
//然后等待promise完成，继续向下执行saga
export const CALL = 'CALL';
export const CPS = 'CPS';