import React from 'react';
import RouterContext from './RouterContext';

export default function Prompt(props) {
    let value = React.useContext(RouterContext);
    React.useLayoutEffect(() => {
        if (props.when) {
            return value.history.block(props.message);
        }
    }, [props.message, props.when, value.history])
    return null;
}
