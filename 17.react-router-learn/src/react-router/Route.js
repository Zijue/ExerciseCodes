import React, { Component } from 'react';
import RouterContext from "./RouterContext";

export default class Route extends Component {
    static contextType = RouterContext;
    render() {
        const { history, location } = this.context;
        const { path, component: RouteComponent } = this.props;
        const match = location.pathname === path;
        const routeProps = { history, location };
        let element = null;
        if (match) {
            element = <RouteComponent {...routeProps} />
        }
        return element;
    }
}
