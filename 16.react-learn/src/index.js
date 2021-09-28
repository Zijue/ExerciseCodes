import React from './react';
import ReactDOM from './react-dom';
import { updateQueue } from './component';

/**
 * 1.组件的数据来源有两个，一个是来自于父组件的属性，组件内可以通过this.props获取，属性是父组件的不能修改
 * 2.组件的状态 state 状态对象是自己内部初始化的，可以修改。唯一能修改状态的方法就是 setState
 * React中绑定事件和原生不一样：
 *  1.属性不是小写，而是驼峰命名
 *  2.值不是字符串而是函数的引用地址
 * 
 * 调用setState和直接修改state的区别：
 *  不管改属性或者setState改状态都会引起组件的重新刷新，让视图更新
 * 
 * state的更新会被合并，当你调用setState()的时候，React会把你提供的对象合并到当前的state
 * state的更新可能是异步的
 *  出于性能考虑，React可能会把多个setState()调用合并成一个调用
 *  因为this.props和this.state可能会异步更新，所以你不要依赖他们的值来更新下一个状态
 *  可以让setState()接收一个函数而不是一个对象。这个函数用上一个state作为第一个参数
 * 
 * 那么什么时候state的更新是异步的呢？
 *  在React能够管理的范围内，比如事件函数、生命周期函数里面都是异步的
 *  除此之外，比如setTimeout、原生事件里面都是同步的
 */
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { number: 0 }; //唯一能给state赋值的地方只有构造函数
    }
    handleClick = (event) => {
        updateQueue.isBatchingUpdate = true;

        //更改状态的时候，只需要传递更新的变量即可
        /**需要注意的是：调用了setState之后，状态this.state并没有立刻修改，而是等handleClick执行完了之后才去更新 */
        /**进行批处理，每次结果+1 */
        this.setState({ number: this.state.number + 1 }); //此处是异步的
        console.log(this.state);
        this.setState({ number: this.state.number + 1 });
        console.log(this.state);
        setTimeout(() => {
            this.setState({ number: this.state.number + 1 });
            console.log(this.state);
            this.setState({ number: this.state.number + 1 });
            console.log(this.state);
        });

        updateQueue.isBatchingUpdate = false;
        updateQueue.batchUpdate();

        /**每次结果+2 */
        // this.setState(state => ({ number: state.number + 1 }));
        // console.log(this.state);
        // this.setState(state => ({ number: state.number + 1 }));
        // console.log(this.state);
    }
    render() {
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
