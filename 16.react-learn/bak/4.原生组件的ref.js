import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
    constructor(props) {
        super(props);
        //React.createRef()就是创建一个对象
        this.a = React.createRef(); // { current: null }
        this.b = React.createRef();
        this.result = React.createRef();
    }
    handleAdd = (event) => {
        let valueA = this.a.current.value;
        let valueB = this.b.current.value;
        this.result.current.value = valueA + valueB;
    }
    render() {
        return (
            <div>
                <input ref={this.a} />+<input ref={this.b} />
                <button onClick={this.handleAdd}>=</button>
                <input ref={this.result} />
            </div>
        )
    }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
