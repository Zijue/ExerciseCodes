import { Component } from 'react'

export default class Lifecycle extends Component {
    componentDidMount() { //使用类组件的声明周期，当挂载完成时去跳转
        this.props.onMount && this.props.onMount(this);
    }
    render() {
        return null;
    }
}
