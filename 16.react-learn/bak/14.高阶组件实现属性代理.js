import React from './react';
import ReactDOM from './react-dom';

/**
 * 高阶组件可以实现属性代理，给组件添加额外的属性，以实现特定的逻辑，可以实现逻辑复用
 * @param {*} OldComponent 
 * @returns 
 */
const withLoading = (OldComponent) => {
    return class extends React.Component {
        render() {
            let state = {
                show() {
                    console.log('show');
                },
                hide() {
                    console.log('hide');
                }
            };
            return (
                <OldComponent {...this.props} {...state} />
            )
        }
    }
}
@withLoading
class Hello extends React.Component {
    render() {
        return (
            <div>
                <p>hello</p>
                <button onClick={this.props.show}>显示</button>
                <button onClick={this.props.hide}>隐藏</button>
            </div>
        )
    }
}
ReactDOM.render(<Hello />, document.getElementById('root'));
