import React, { Component } from 'react';
import RouterContext from "./RouterContext";
import matchPath from './matchPath';

export default class Route extends Component {
    static contextType = RouterContext;
    render() {
        console.log('Route', this.props.path);
        const { history, location } = this.context;
        const {/* path, */ component: RouteComponent, computedMatch, render, children } = this.props;
        // const match = location.pathname === path;
        //如果有computedMatch属性，就直接用，否则就再重新计算一次match结果
        const match = computedMatch ? computedMatch : matchPath(location.pathname, this.props);
        const routeProps = { history, location };
        let element = null;
        if (match) {
            routeProps.match = match; //Route匹配上，就给routeProps添加一个match属性
            this.context.params = match.params;
            if (RouteComponent) {
                element = <RouteComponent {...routeProps} />
            } else if (render) {
                element = render(routeProps);
            } else if (children) {
                element = children(routeProps);
            } else {
                element = null;
            }
        } else {
            //不管是否匹配，都会渲染children；但是没有match属性
            if (children) {
                element = children(routeProps);
            } else {
                element = null;
            }
        }
        return element;
    }
}
