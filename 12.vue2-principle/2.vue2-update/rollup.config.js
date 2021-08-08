import babel from 'rollup-plugin-babel'; // 让rollup打包的时候可以采用babel

export default { // 选用rollup的原因是打包js类库、体积小，rollup主要就是专注打包js模块的
    input: './src/index.js', // 打包的入口
    output: {
        file: 'dist/vue.js', // 打包后的文件存放在output中
        format: 'umd', // 统一模块规范，支持commonjs、amd，同时还可以在window上挂载Vue属性，需要指定
        name: 'Vue', // 指定在window上挂载的属性名
        sourcemap: true, // 为了增加调试功能
    },
    plugins: [
        babel({
            exclude: 'node_modules/**', // 不去编译node_modules下的文件
        })
    ]
}