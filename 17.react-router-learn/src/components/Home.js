import React, { Component } from 'react'

export default class Home extends Component {
    render() {
        return (
            <div>
                <p>Home</p>
                <button onClick={() => this.props.history.push('/profile')}>跳转到/profile</button>
            </div>
        )
    }
}
