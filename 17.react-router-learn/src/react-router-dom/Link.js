import { __RouterContext as RouterContext } from '../react-router';

export default function Link(props) {
    return (
        <RouterContext.Consumer>
            {
                (value) => {
                    return ( //Link就是一个<a>标签
                        <a {...props} onClick={(event) => {
                            event.preventDefault(); //阻止默认事件
                            value.history.push(props.to);
                        }}>{props.children}</a>
                    )
                }
            }
        </RouterContext.Consumer>
    )
}
