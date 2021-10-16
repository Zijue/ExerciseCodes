import React from './react';
import ReactDOM from './react-dom';

function Child(props, ref) {
    let inputRef = React.useRef();
    //命令式的ref，可以自定义向外使用的对象
    React.useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current.focus();
        }
    }));
    return <input ref={inputRef} />
}
let ForwardChild = React.forwardRef(Child);

function Parent() {
    let inputRef = React.useRef();
    let getFocus = () => {
        inputRef.current.focus();
    }
    return (
        <div>
            <ForwardChild ref={inputRef} />
            <button onClick={getFocus}>获取焦点</button>
        </div>
    )
}
ReactDOM.render(<Parent />, document.getElementById('root'));