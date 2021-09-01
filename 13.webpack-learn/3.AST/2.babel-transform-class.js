const core = require('@babel/core');
const types = require('babel-types');
// const babelPluginTransformClasses = require('@babel/plugin-transform-classes');

const babelPluginTransformClasses = {
    visitor: {
        ClassDeclaration(nodePath) {
            let { node } = nodePath;
            let { id } = node; // {type: 'Identifier', name: 'Person'}
            let classMethods = node.body.body;
            let nodes = []; // 存放转换后的ES5的函数节点
            // 循环出所有的类方法，然后生成ES5的方法
            classMethods.forEach((classMethod) => {
                if (classMethod.kind == 'constructor') { // 构造函数
                    let constructorFunction = types.FunctionDeclaration(
                        id,
                        classMethod.params,
                        classMethod.body,
                        classMethod.generator,
                        classMethod.async
                    );
                    nodes.push(constructorFunction);
                } else { // 普通函数
                    // 创建Person.prototype
                    let prototypeMemberExpression = types.MemberExpression(
                        id,
                        types.Identifier('prototype')
                    );
                    // 创建Person.prototype.getName
                    let memberExpression = types.MemberExpression(
                        prototypeMemberExpression,
                        classMethod.key // getName
                    );
                    // 创建函数体
                    let functionExpression = types.functionExpression(
                        classMethod.key,
                        classMethod.params,
                        classMethod.body,
                        classMethod.generator,
                        classMethod.async
                    );
                    // 将函数体赋值给函数定义
                    let assignmentExpression = types.assignmentExpression(
                        "=",
                        memberExpression,
                        functionExpression
                    );
                    nodes.push(assignmentExpression);
                }
            });
            // 用新节点替换老节点
            if (nodes.length > 1) {
                nodePath.replaceWithMultiple(nodes);
            } else {
                nodePath.replaceWith(nodes[0]);
            }
        }
    }
}

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