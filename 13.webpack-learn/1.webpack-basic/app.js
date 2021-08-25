const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');
webpackOptions.mode = 'development';
const compiler = webpack(webpackOptions); // compiler代表webpack编译对象
app.use(webpackDevMiddleware(compiler, {}));
app.get('/api/users', (req, res) => {
    res.json([{ id: 1 }, { id: 2 }])
})
app.listen(3000);

// 本质上来说：webpack-dev-server 就是 express + webpack-dev-middleware
