import React from './react';
import ReactDOM from './react-dom';

class Dialog extends React.Component {
    render() {
        //ReactDOM.createPortal其实就是render方法，用于将内容渲染到非root节点上，一般用在模态框场景中
        //使用这样的方式，render方法将没有返回值，是一个null，需要在之前的代码中进行处理
        return ReactDOM.createPortal(
            <div className="dialog">{this.props.message}</div>,
            document.getElementById('dialog')
        )
    }
}
class App extends React.Component {
    render() {
        return (
            <div>
                <Dialog message="模态窗口" />
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'));
