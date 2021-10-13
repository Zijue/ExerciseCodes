import React from './react';
import ReactDOM from './react-dom';

/**
 * 高阶组件可以实现反向继承
 * 一般来说子组件继承父组件，这个叫正向继承；
 * 但假如你使用一个第三方库，源代码你无法修改，但又想扩展其功能
 */
const wrapper = (OldComponent) => {
    return class extends OldComponent {
        state = { number: 0 }
        handleClick = () => {
            this.setState({ number: this.state.number + 1 });
        }
        componentWillMount() {
            console.log('child componentWillMount');
            super.componentWillMount();
        }
        componentDidMount() {
            console.log('child componentDidMount');
            super.componentWillMount();
        }
        render() {
            console.log('wrapper render');
            let renderElement = super.render();
            let newProps = {
                ...renderElement.props,
                onClick: this.handleClick
            }
            return React.cloneElement(
                renderElement, //type
                newProps, //属性
                this.state.number //儿子
            )
        }
    }
}

//假如说这是一个第三方组件，只能使用无法修改源码
class Button extends React.Component {
    state = { name: '紫珏' }
    componentWillMount() {
        console.log('parent componentWillMount');
    }
    componentDidMount() {
        console.log('parent componentDidMount')
    }
    render() {
        console.log('Button render');
        return (
            <button name={this.state.name}>{this.props.title}</button>
        )
    }
}
let WrapperButton = wrapper(Button);
ReactDOM.render(<WrapperButton title='按钮的标题' />, document.getElementById('root'));
/**
 * 反向继承实现的过程就是通过高阶组件，获取需要扩展的组件的renderVdom
 * 之后通过React.cloneElement修改其虚拟dom的属性并作为新的组件返回
 */