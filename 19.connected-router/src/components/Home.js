import React, { Component } from 'react';

export default class Home extends Component {
    render() {
        return (
            <div>
                Home
                <button onClick={() => this.props.history.goBack()}>返回</button>
            </div>
        )
    }
}
