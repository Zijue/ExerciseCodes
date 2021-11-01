import React, { Component } from 'react';
import RouterContext from "./RouterContext";
import matchPath from './matchPath';

export default class Route extends Component {
    static contextType = RouterContext;
    render() {
        console.log('Route', this.props.path);
        const { history, location } = this.context;
        const {/* path, */ component: RouteComponent, computedMatch } = this.props;
        // const match = location.pathname === path;
        //如果有computedMatch属性，就直接用，否则就再重新计算一次match结果
        const match = computedMatch ? computedMatch : matchPath(location.pathname, this.props);
        const routeProps = { history, location };
        let element = null;
        if (match) {
            routeProps.match = match;
            element = <RouteComponent {...routeProps} />
        }
        return element;
    }
}
