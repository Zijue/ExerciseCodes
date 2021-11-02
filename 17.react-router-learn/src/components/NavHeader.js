import React, { Component } from 'react';
import { withRouter } from '../react-router';

//TypeError: Cannot read properties of undefined (reading 'push')
//只有Route渲染出来的组件才会有props.history属性
class NavHeader extends Component {
    render() {
        return (
            <div onClick={() => this.props.history.push('/')}>
                {this.props.title}
            </div>
        )
    }
}
export default withRouter(NavHeader);
