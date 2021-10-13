import React from './react';
import ReactDOM from './react-dom';

//其实context实现原理就只是一个共享的变量，仅此而已
let ThemeContext = React.createContext();
/**
 * 类组件中要想获取ThemeContext.Provider的value属性的值有两种方式
 * 1.给类组件添加属性static contentType=ThemeContext，this.context获取value的值
 * 2.可以使用ThemeContext.Consumer组件获取到value值，Consumer组件的儿子是一个函数，函数参数就是value值
 */
class Header extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ margin: '5px', padding: '5px', border: `5px solid ${this.context.color}` }}>
                Header
                <Title />
            </div>
        )
    }
}
class Title extends React.Component {
    render() {
        return (
            <ThemeContext.Consumer>
                {
                    (value) => (
                        <div style={{ margin: '5px', padding: '5px', border: `5px solid ${value.color}` }}>
                            Title
                        </div>
                    )
                }
            </ThemeContext.Consumer>
        )
    }
}
class Main extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ margin: '5px', padding: '5px', border: `5px solid ${this.context.color}` }}>
                Main
                <Content />
            </div>
        )
    }
}
class Content extends React.Component {
    render() {
        return (
            <ThemeContext.Consumer>
                {
                    (value) => (
                        <div style={{ margin: '5px', padding: '5px', border: `5px solid ${value.color}` }}>
                            Content
                            <button onClick={() => value.changeColor('red')}>变红</button>
                            <button onClick={() => value.changeColor('green')}>变绿</button>
                        </div>
                    )
                }
            </ThemeContext.Consumer>
        )
    }
}
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: 'red' };
    }
    changeColor = (color) => {
        this.setState({ color });
    }
    render() {
        let contextVal = { color: this.state.color, changeColor: this.changeColor };
        return (
            <ThemeContext.Provider value={contextVal}>
                <div style={{ margin: '5px', padding: '5px', border: `5px solid ${this.state.color}`, width: '300px' }}>
                    Page
                    <Header />
                    <Main />
                </div>
            </ThemeContext.Provider>
        )
    }
}
ReactDOM.render(<Page />, document.getElementById('root'));
