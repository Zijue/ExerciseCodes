import RouterContext from "./RouterContext";

export default function withRouter(OldComponent) { //高阶组件
    return (props) => {
        return (
            <RouterContext.Consumer>
                {
                    (value) => { //history location match
                        return <OldComponent {...props} {...value} />
                    }
                }
            </RouterContext.Consumer>
        )
    }
}
