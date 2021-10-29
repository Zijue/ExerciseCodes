import React, { Component } from 'react'

export default class Profile extends Component {
    render() {
        console.log(this.props); // {history, location, match}
        return (
            <div>
                <p>Profile</p>
            </div>
        )
    }
}