import React from "react";
import RouterContext from "./RouterContext";

class Router extends React.Component {
    static computeRootMatch(pathname) {
        return { path: '/', url: '/', params: {}, isExact: pathname === '/' };
    }
    constructor(props) {
        super(props);
        this.state = {
            location: props.history.location
        }
        //当监听到路由发生变化后会执行回调
        this.unlisten = props.history.listen((location) => {
            //listener初次渲染的时候不会执行，只有当history发生改变时，才会执行
            console.log('listener', location);
            this.setState({ location });
        })
    }
    componentWillUnmount() {
        this.unlisten(); //组件将要销毁的时候取消监听
    }
    render() {
        let value = {
            history: this.props.history, //history外部属性传入
            location: this.state.location,
            match: Router.computeRootMatch(this.state.location.pathname)
        }
        // console.log(value); //打印查看history的值
        return (
            <RouterContext.Provider value={value}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}
export default Router;