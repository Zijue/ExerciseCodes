const path = require('path');
const DonePlugin = require('./plugins/done-plugin');
const AssetPlugin = require('./plugins/asset-plugin');
const ArchivePlugin = require('./plugins/archive-plugin');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    plugins: [
        // new DonePlugin(),
        // new AssetPlugin(),
        new ArchivePlugin({
            filename: '[timestamp].zip'
        }),
    ]
}