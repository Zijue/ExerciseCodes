// 实现一个babel插件
// 把ES6的箭头函数变成ES5的普通函数
const core = require('@babel/core');
const types = require('babel-types');
// const babelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');
// 自己实现一个转换插件
const babelPluginTransformEs2015ArrowFunctions = {
    visitor: { // 访问者visitor（访问器模式）
        // 属性就是这个插件关心或者说要处理的节点的类型
        ArrowFunctionExpression(nodePath) {
            let node = nodePath.node;
            hoistFunctionEnvironment(nodePath); // 需要提升箭头函数的执行环境，确定this的指向
            node.type = 'FunctionExpression'; // 将箭头函数替换成普通函数类型
        }
    }
}
function hoistFunctionEnvironment(fnPath) {
    // thisEnvFn 就是可以确定this指向的环境
    const thisEnvFn = fnPath.findParent(p => {
        return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
        // 等同于 return (types.isFunction(p.node) && !types.isArrowFunctionExprssion(p.node)) || types.isProgram(p.node);
    });
    let thisPaths = getScopeInfomation(fnPath); // 收集this的path
    let thisBinding = '_this'; // this最后需要绑定的值
    // types 的作用：1.用来判断某个节点是不是某个类型；2.用来创建一个新的节点
    if (thisPaths.length > 0) {
        thisEnvFn.scope.push({ // 创建 var _this = this;
            type: "VariableDeclarator",
            id: types.identifier(thisBinding),
            init: types.thisExpression()
        });
        // 将使用到this的地方全部替换为_this
        thisPaths.forEach(thisPath => {
            thisPath.replaceWith(types.identifier(thisBinding))
        })
    }
}
function getScopeInfomation(fnPath) {
    let thisPaths = [];
    fnPath.traverse({
        ThisExpression(thisPath) {
            thisPaths.push(thisPath);
        }
    });
    return thisPaths;
}
let sourceCode = `
    const sum = (a, b) => {
        console.log(this);
        console.log(this);
        return a + b;
    }
`
let { code } = core.transform(sourceCode, {
    plugins: [babelPluginTransformEs2015ArrowFunctions]
});
console.log(code);
