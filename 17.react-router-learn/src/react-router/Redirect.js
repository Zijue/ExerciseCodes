import Lifecycle from './Lifecycle';
import RouterContext from './RouterContext';

/**
 * 要想跳转路径需要调用history.push
 * @param {*} props 
 * @returns 
 */
export default function Redirect(props) {
    return (
        <RouterContext.Consumer>
            {
                (value) => {
                    // value.history.push(props.to); //这样就已经可以实现redirect了
                    // return null;

                    return (
                        <Lifecycle onMount={() => value.history.push(props.to)} />
                    )
                }
            }
        </RouterContext.Consumer>
    )
}

