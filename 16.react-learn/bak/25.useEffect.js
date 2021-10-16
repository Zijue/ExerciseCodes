import React from './react';
import ReactDOM from './react-dom';

function Counter() {
    const [number, setNumber] = React.useState(0);
    //useEffect里面的函数会在组件渲染到页面中之后执行
    React.useEffect(() => {
        console.log('开启定时器');
        const timer = setInterval(() => {
            setNumber(number => number + 1);
        }, 1000);
        //可以返回一个销毁函数，它会在下次执行effect之前执行
        return () => {
            console.log('销毁定时器');
            clearInterval(timer); //在开启下一个定时器之前会把上一个定时器清理掉
        }
    }, []); //或者第二次参数给个空数组，这样依赖数组一直不变，就不会多次执行useEffect；就可以不用返回一个销毁函数
    return (
        <div>{number}</div>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));