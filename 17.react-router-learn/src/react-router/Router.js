import React from "react";
import RouterContext from "./RouterContext";

class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: props.history.location
        }
        //当监听到路由发生变化后会执行回调
        props.history.listen((location) => {
            // console.log(location);
            this.setState({ location });
        })
    }
    render() {
        let value = {
            history: this.props.history, //history外部属性传入
            location: this.state.location
        }
        return (
            <RouterContext.Provider value={value}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}
export default Router;