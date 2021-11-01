import React from 'react';
import { Route, Link } from '../react-router-dom'

export default function NavLink(props) {
    //哪个Link被激活，核心原理就是地址栏中的location.pathname和to一致
    const {
        to, //是要跳转的路径
        exact, //是否精确匹配
        className = '', //类名
        activeClassName = 'active', //激活类名
        style = {}, //行内样式对象
        activeStyle = {}, //激活样式对象
        children
    } = props
    return (
        <Route path={to} exact={exact}>
            {
                ({ match }) => { //routeProps.match解构
                    let linkProps = {
                        className: match ? `${className} ${activeClassName}` : className,
                        style: match ? { ...style, ...activeStyle } : style,
                        to,
                        children
                    }
                    console.log(linkProps);
                    return <Link {...linkProps} />
                }
            }
        </Route>
    )
}
