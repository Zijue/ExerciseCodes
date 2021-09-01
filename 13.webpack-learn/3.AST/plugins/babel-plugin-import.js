// 手动实现一个webpack按需加载模块
const types = require('babel-types');

const babelImportPlugin = {
    visitor: {
        ImportDeclaration: {
            enter(nodePath, state) {
                // console.log(state)
                let { node } = nodePath;
                let {
                    opts: { libraryName, libraryDirectory }
                } = state;
                let source = node.source; // lodash
                let specifiers = node.specifiers; // 引入的变量
                // 引入的模块名等于插件配置的模块名 && 不是默认导入 => 才处理
                if (libraryName === source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
                    let importDeclarations = specifiers.map(specifier => {
                        return types.importDeclaration(
                            [types.importDefaultSpecifier(specifier.local)],
                            types.stringLiteral(`${source.value}/${specifier.local.name}`)
                        )
                    });
                    nodePath.replaceWithMultiple(importDeclarations);
                }
            }
        }
    }
}
// 以函数的方式导出
module.exports = function () {
    return babelImportPlugin
}