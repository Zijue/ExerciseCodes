const core = require('@babel/core');
const types = require('babel-types');
const babelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');

let sourceCode = `
    const sum = (a, b) => {
        console.log(this);
        return a + b;
    }
`
let { code } = core.transform(sourceCode, {
    plugins: [babelPluginTransformEs2015ArrowFunctions]
});
console.log(code);
