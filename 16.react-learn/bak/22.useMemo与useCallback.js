import React from './react';
import ReactDOM from './react-dom';

function Child({ data, handleClick }) {
    console.log('Child render');
    return (
        <button onClick={handleClick}>{data.number}</button>
    )
}
let MemoChild = React.memo(Child);
function App() {
    console.log('App render');
    const [name, setName] = React.useState('zijue');
    const [number, setNumber] = React.useState(0);
    //useMemo和useCallback接受两个参数，一个工厂函数，一个依赖（用于对比）
    let data = React.useMemo(() => ({ number }), [number]);
    let handleClick = React.useCallback(() => setNumber(number + 1), [number]);
    /**
     * 不使用React.useCallback，修改input输入框中的内容，子组件依旧会更新，原因是：
     * 每次修改都会触发useState更新，然后React.memo的属性对比函数为shallowEqual，且每次更新时，handleClick函数
     * 都会新的函数，所以返回结果必然为false，所以子组件MemoChild一定会重新渲染，要想解决这个问题，就需要使用
     * React.useMemo、React.useCallback
     */
    return (
        <div>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
            <MemoChild data={data} handleClick={handleClick} />
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));