import React from 'react';
import ReactDOM from 'react-dom';

function Animation() {
    const ref = React.useRef();
    React.useLayoutEffect(() => {
        ref.current.style.transform = 'translate(500px)';
        ref.current.style.transition = 'all 500ms';
    });
    /**
     * useEffect动画会出现，而useLayoutEffect动画不会出现的原因是：
     * useEffect是宏任务，在页面绘制完成之后执行，所以会先渲染老的绘制，然后执行动画，
     * 而useLayoutEffect是微任务，在页面绘制之前执行，所以直接渲染新的位置
     */
    // React.useEffect(() => {
    //     ref.current.style.transform = 'translate(500px)';
    //     ref.current.style.transition = 'all 500ms';
    // });
    let style = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'red'
    }
    return (
        <div style={style} ref={ref}></div>
    )
}
ReactDOM.render(<Animation />, document.getElementById('root'));