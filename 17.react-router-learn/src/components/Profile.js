import React, { Component } from 'react'

export default class Profile extends Component {
    render() {
        // console.log(this.props); // {history, location}
        return (
            <div>
                <p>Profile</p>
                <button onClick={() => this.props.history.goBack()}>返回</button>
            </div>
        )
    }
}