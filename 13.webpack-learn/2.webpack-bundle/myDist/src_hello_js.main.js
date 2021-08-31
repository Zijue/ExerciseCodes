// 注意：此处的push不是数组的，而是webpackJSONP回调函数
window['webpackChunk_2_bundle'].push([['src_hello_js'], {
    './src/hello.js': function (module, exports, require) {
        require.r(exports); // 把此模块标注为一个ES module
        require.d(exports, {
            default: () => DEFAULT_EXPORT
        });
        var DEFAULT_EXPORT = 'hello'
    }
}]);