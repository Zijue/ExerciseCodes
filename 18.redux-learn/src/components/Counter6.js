import React, { Component } from "react";
import { connect } from 'react-redux'
import actions from '../store/actionCreators/counter6';

class Counter6 extends Component {
    render() {
        const { number, add6, minus6 } = this.props;
        return (
            <div>
                <p>{number}</p>
                <button onClick={add6}>+</button>
                <button onClick={minus6}>-</button>
                <button onClick={
                    () => {
                        setTimeout(add6, 1000);
                    }
                }>1秒后加1</button>
            </div>
        )
    }
}
/**
 * state={counter5:{number:0},counter6:{number:0}}
 * 组件和仓库的关系
 * 输入：取总状态的某一部分通过属性输入到组件中
 * 输出：
 */
const mapStateToProps = (state) => state.counter6;
export default connect(
    mapStateToProps,
    actions
)(Counter6);