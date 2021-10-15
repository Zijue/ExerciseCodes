import React from './react';
import ReactDOM from './react-dom';

function App() {
    const [number1, setNumber1] = React.useState(0);
    const [number2, setNumber2] = React.useState(0);
    let handleClick1 = () => setNumber1(number1 + 1);
    let handleClick2 = () => setNumber2(number2 + 1);
    //不管点击handleClick1还是handleClick2，都会触发全量更新以及number的取值，按照顺序取值
    return (
        <div>
            <p>{number1}</p>
            <p>{number2}</p>
            <button onClick={handleClick1}>+</button>
            <button onClick={handleClick2}>+</button>
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
