function createBrowserHistory() {
    const globalHistory = window.history;
    let state;
    let listeners = [];
    /**
     * 添加一个路由条目，并移动指针指向栈顶
     * @param {*} pathname 路径名
     * @param {*} nextState 新状态
     */
    function push(pathname, nextState) {
        /**
         * 给push传递参数有下面两种方式
         * push('/user', {id:1, name:'zijue'})
         * push({pathname:'/user', state:{id:1, name: 'zijue'}})
         */
        //所以需要先处理参数
        let action = 'PUSH'; //action对应三种状态 push PUSH; pop POP; replace REPLACE
        if (typeof pathname === 'object') {
            state = pathname.state;
            pathname = pathname.pathname
        } else {
            state = nextState
        }
        //调用原生的pushState方法跳转路径
        globalHistory.pushState(state, null, pathname);
        let location = { pathname, state };
        notify({ action, location });
    }
    function notify(newHistory) {
        // Object.assign(history, { location }); //保证history.location和location永远相同，等价于history.location=location
        Object.assign(history, newHistory); //{ action, location }
        listeners.forEach(listener => listener(history.location));
    }
    function listen(listener) {
        listeners.push(listener);
        //监听方法会返回一个取消此监听函数的方法
        return () => listeners = listeners.filter(l => l !== listener);
    }
    //go back forward => 就会触发popstate事件
    window.addEventListener('popstate', (event) => {
        let location = { pathname: window.location.pathname, state: window.location.state };
        notify({ action: 'POP', location });
    });
    function go(n) {
        globalHistory.go(n);
    }
    function goForward() {
        globalHistory.go(1);
    }
    function goBack() {
        globalHistory.go(-1);
    }
    const history = {
        action: "POP", //pushState PUSH; popState POP; replace REPLACE
        push,
        listen,
        go,
        goBack,
        goForward,
        location: { pathname: window.location.pathname, state: window.location.state }
    };
    return history;
}
export default createBrowserHistory;
/**
action: "POP"
block: ƒ block(prompt)
createHref: ƒ createHref(location)
go: ƒ go(n)
goBack: ƒ goBack()
goForward: ƒ goForward()
length: 5
listen: ƒ listen(listener)
location: {pathname: '/user', search: '', hash: '', state: undefined}
push: ƒ push(path, state)
replace: ƒ replace(path, state)
 */