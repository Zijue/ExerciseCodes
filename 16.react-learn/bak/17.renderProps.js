import React from 'react';
import ReactDOM from 'react-dom';

/**
 * render props 基本写法
 */
class MouseTracker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event) => {
        this.setState({
            x: event.clientX,
            y: event.clientY
        });
    }
    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                {/* {this.props.children(this.state)} */}
                {this.props.render(this.state)}
            </div>
        )
    }
}
//采用如下的方式，可以实现代码的复用，同时还比较的灵活 -- children的写法
// ReactDOM.render(<MouseTracker>
//     {
//         (props) => (
//             <div>
//                 <h1>请移动鼠标</h1>
//                 <p>当前的鼠标位置是{props.x} {props.y}</p>
//             </div>
//         )
//     }
// </MouseTracker>, document.getElementById('root'));
//还有如下的一种写法，也就是render props
ReactDOM.render(<MouseTracker render={
    (props) => (
        <div>
            <h1>请移动鼠标</h1>
            <p>当前的鼠标位置是{props.x} {props.y}</p>
        </div>
    )
} />, document.getElementById('root'));
