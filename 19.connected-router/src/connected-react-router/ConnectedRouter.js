import React, { Component } from 'react';
import { ReactReduxContext } from 'react-redux';
import { Router } from 'react-router';
import { onLocationChange } from './actions';

/**
 * 这个组件用来替代原来的Router容器组件；负责监听路径变化，然后派发动作
 */
export default class ConnectedRouter extends Component {
    static contextType = ReactReduxContext;
    constructor(props, context) {
        super(props);
        this.unlisten = this.props.history.listen((location, action) => {
            //Provider._currentValue={store} 上下文中传递了一个store属性
            context.store.dispatch(onLocationChange(location, action)); //当地址栏路径变化后，执行派发
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }
    render() {
        return (
            <Router history={this.props.history}>
                {this.props.children}
            </Router>
        )
    }
}
