import React, { Component } from 'react';
import { Link } from '../react-router-dom';
import { UserAPI } from '../utils';

export default class UserList extends Component {
    state = { users: [] }
    componentDidMount() { //组件挂载完成后，调用更新渲染数据
        let users = UserAPI.list();
        this.setState({ users });
    }
    render() {
        return (
            <ul>
                {
                    this.state.users.map((user, index) => (
                        <li key={index}>
                            <Link to={{ pathname: `/user/detail/${user.id}`, state: user }}>{user.username}</Link>
                        </li>
                    ))
                }
            </ul>
        )
    }
}
