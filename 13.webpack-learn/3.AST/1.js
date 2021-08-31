let esprima = require('esprima');
let estraverse = require('estraverse');
let escodegen = require('escodegen');

let sourceCode = `function ast(){}`;
// esprima将源码解析成抽象ast语法树
let ast = esprima.parse(sourceCode);
console.log(ast)
// estraverse用来遍历语法树上的所有节点，然后可以处理你关心的节点
// 遍历的过程是一个深度优先的过程
let ident = 0
const padding = () => ' '.repeat(ident);
// 这里用了一个访问器模式
estraverse.traverse(ast, {
    enter(node) {
        ident += 2;
        console.log(padding() + node.type + '进入');
        if (node.type === 'FunctionDeclaration') {
            node.id.name = 'newAST';
        }
    },
    leave(node) {
        ident -= 2;
        console.log(padding() + node.type + '离开');
    }
});
let targetCode = escodegen.generate(ast);
console.log(targetCode);