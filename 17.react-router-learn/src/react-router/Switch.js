import React, { Component } from 'react';
import RouterContext from './RouterContext';
import matchPath from './matchPath';

export default class Switch extends Component {
    static contextType = RouterContext;
    render() {
        const { location } = this.context;
        let element, match;
        //this.props.children=[Route,Route,Route]
        //this.props.children.forEach();
        //使用React.Children.forEach工具方法的好处是，避免了一些异常的情况（如children为null）
        React.Children.forEach(this.props.children, (route) => {
            if (!match && React.isValidElement(route)) {
                element = route;
                match = matchPath(location.pathname, route.props);
            }
        });
        return match ? React.cloneElement(element, { computedMatch: match }) : null;
    }
}
