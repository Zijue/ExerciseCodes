function createHashHistory(props) {
    let historyStack = [];  //类似于history栈
    let current = -1;       //代表当前的栈顶指针
    let action = 'POP';     //代表当前的动作
    let state;              //代表当前的状态
    let listeners = [];     //监听函数组成的数组
    let message = null;
    let confirm = props.getUserConfirmation ? props.getUserConfirmation : window.confirm;
    function listen(listener) {
        listeners.push(listener);
        //监听方法会返回一个取消此监听函数的方法
        return () => listeners = listeners.filter(l => l !== listener);
    }
    function hashChangeHandler(event) {
        let pathname = window.location.hash.slice(1);
        let location = { pathname, state };
        Object.assign(history, { action, location });
        if (action === 'PUSH') {
            historyStack[++current] = location;
        }
        listeners.forEach(listener => listener(history.location));
    }
    window.addEventListener('hashchange', hashChangeHandler);
    function go(n) {
        action = 'POP';
        current += n;
        let nextLocation = historyStack[current];
        state = nextLocation.state;
        window.location.hash = nextLocation.pathname;
    }
    function goBack() {
        go(-1);
    }
    function goForward() {
        go(1);
    }
    function push(pathname, nextState) {
        action = 'PUSH';
        if (typeof pathname === 'object') {
            state = pathname.state;
            pathname = pathname.pathname;
        } else {
            state = nextState;
        }
        if (message) {
            let showMessage = message({ pathname });
            let allow = confirm(showMessage);
            if (!allow) return;
        }
        window.location.hash = pathname;
    }
    function block(newMessageFn) {
        message = newMessageFn;
        return () => message = null;
    }
    const history = {
        action: "POP", //pushState PUSH; popState POP; replace REPLACE
        listen,
        go,
        goBack,
        goForward,
        push,
        location: { pathname: window.location.pathname, state: window.location.state },
        block
    };
    /**
     * 此history还有bug，当不加url访问时，跳转后返回，会出错
     */
    if (window.location.hash) {
        action = 'PUSH';
        hashChangeHandler();
    } else {
        window.location.hash = '/';
    }
    return history;
}
export default createHashHistory;
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