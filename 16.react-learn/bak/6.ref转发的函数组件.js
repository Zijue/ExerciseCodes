import React from './react';
import ReactDOM from './react-dom';

function TextInput(props, ref) {
    return <input ref={ref} />
}
const ForwardTextInput = React.forwardRef(TextInput);
console.log(ForwardTextInput);
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }
    getFocus = () => {
        this.input.current.focus();
    }
    render() {
        //最终ref传递的this.input指向了TextInput的原生input
        return (
            <div>
                <ForwardTextInput ref={this.input} />
                <button onClick={this.getFocus}>获取焦点</button>
            </div>
        )
    }
}
ReactDOM.render(<Form />, document.getElementById('root'));
/**
 * Warning: Function components cannot be given refs.
 * Attempts to access this ref will fail.
 * Did you mean to use React.forwardRef()?
 */