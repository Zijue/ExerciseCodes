import React, { Component } from "react";
import { bindActionCreators } from '../redux';
import actions from '../store/actionCreators/counter3';
import store from '../store';

const boundActions = bindActionCreators(actions, store.dispatch);
export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState().counter3;
    }
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().counter3.number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={boundActions.add3}>+</button>
                <button onClick={boundActions.minus3}>-</button>
                <button onClick={
                    () => {
                        setTimeout(boundActions.add3, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}