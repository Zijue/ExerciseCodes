let dispatch; //它会指向改造后的dispatch，这时dispatch是undefined
let middlewareAPI = {
    dispatch: (action) => dispatch(action) //延迟给dispatch变量赋值
    //如果middlewareAPI的dispatch的属性，直接赋值dispatch变量的话，那么后续改变dispatch变量，
    //也不会修改middlewareAPI的dispatch属性
}
dispatch = (action) => { console.log('dispatch', action); }

middlewareAPI.dispatch({ type: 'add' });