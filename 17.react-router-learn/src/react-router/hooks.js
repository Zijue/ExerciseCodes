import React from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';

export function useHistory() {
    let contextValue = React.useContext(RouterContext);
    return contextValue.history;
}
export function useLocation() {
    let contextValue = React.useContext(RouterContext);
    return contextValue.location;
}
export function useParams() {
    //此处简单实现，具体查看源码；根据张老说法，源码在上下文上挂了一个matches属性，利用栈特性取值matches[matches.length-1]
    let { params } = React.useContext(RouterContext);
    return params || {};
}
/**
 * 获取一个路径的匹配结果。与useParams的区别在于，useParams用的是当前Route的path
 * @param {*} pathInfo 传递一个路径
 */
export function useRouteMatch(pathInfo) {
    //获取当前的真实路径 /user/detail/100
    const location = useLocation();
    //获取match其实是根match
    let match = React.useContext(RouterContext).match;
    //如果传递了path，那就用当前真实的pathname跟用户指定的path进行匹配，得到匹配结果
    //如果没有传递path，那就返回根匹配match(位于Router.js) { path: '/', url: '/', params: {}, isExact: pathname === '/' }
    return pathInfo ? matchPath(location.pathname, pathInfo) : match;
}