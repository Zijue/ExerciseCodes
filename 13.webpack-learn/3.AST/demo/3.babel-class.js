const core = require('@babel/core');
const types = require('babel-types');
const babelPluginTransformClasses = require('@babel/plugin-transform-classes');

let sourceCode = `
    class Person {
        constructor(name) {
            this.name = name;
        }
        getName() {
            return this.name;
        }
    }
`
let { code } = core.transform(sourceCode, {
    plugins: [babelPluginTransformClasses]
});
console.log(code);