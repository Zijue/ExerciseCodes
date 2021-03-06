import React, { Component } from "react";
import { bindActionCreators } from '../redux';
import actions from '../store/actionCreators/counter4';
import store from '../store';

const boundActions = bindActionCreators(actions, store.dispatch);
export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState().counter4;
    }
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().counter4.number }));
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={boundActions.add4}>+</button>
                <button onClick={boundActions.minus4}>-</button>
                <button onClick={
                    () => {
                        setTimeout(boundActions.add4, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}