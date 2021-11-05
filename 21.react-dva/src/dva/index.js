import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux';

export { connect };
function dva() {
    const app = {
        _models: [],
        model,
        _router: null,
        router,
        start,
    }
    function model(modelConfig) {
        app._models.push(modelConfig);
    }
    function router(routerConfig) {
        app._router = routerConfig;
    }
    function start(root) {
        ReactDOM.render(app._router, document.getElementById(root));
    }
    return app;
}
export default dva;