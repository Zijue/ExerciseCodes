const path = require('path');
const fs = require('fs');
let types = require("babel-types");
let parser = require("@babel/parser");
let traverse = require("@babel/traverse").default;
let generator = require("@babel/generator").default;

function toUnixPath(filePath) {
    return filePath.replace(/\\/g, "/");
}
let basePath = toUnixPath(process.cwd()); // 将win的\统一为/

class Complication {
    constructor(options) {
        this.options = options;
        this.modules = []; // 存放着本次编译产出的所有的模块，所有的入口产出的模块
        this.chunks = []; // 代码块的数组
        this.entrypoints = new Map(); // 入口的映射
        this.assets = {}; // 产出的资源
        this.files = [];
    }
    // 这个才是webpack编译最核心的方法
    build(callback) {
        // 5.根据配置中的entry找出入口文件
        let entry = {};
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry;
        } else {
            entry = this.options.entry;
        }
        for (let entryName in entry) {
            let entryFilePath = path.posix.join(basePath, entry[entryName]); // 获取入口文件的绝对路径
            // 6.从入口文件出发，调用所有配置的loader对模块进行编译
            let entryModule = this.buildModule(entryName, entryFilePath);
            // 8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk
            let chunk = {
                name: entryName, // 代码块的名字就是入口的名字
                entryModule, // 入口模块
                modules: this.modules.filter(module => module.name === entryName)
            }
            this.chunks.push(chunk);
            this.entrypoints.set(entryName, {
                name: entryName,
                chunks: [entryName]
            });
        }
        // 9.再把每个chunk转换成一个单独的文件加入到输出列表
        this.chunks.forEach(chunk => {
            let filename = this.options.output.filename.replace('[name]', chunk.name);
            this.assets[filename] = getSource(chunk); // 就是拼字符串
        });
        this.files = Object.keys(this.assets);

        callback(null, {
            entrypoints: this.entrypoints,
            chunks: this.chunks,
            modules: this.modules,
            files: this.files,
            assets: this.assets
        });
    }
    buildModule(name, modulePath) { // name：此模块是属于哪个入口的，modulePath：模块的绝对路径
        // 6.1.读取模块的内容
        let sourceCode = fs.readFileSync(modulePath, 'utf-8'); // 异步性能更高，此处图简单使用同步的方式
        let { rules } = this.options.module;
        let loaders = []; // 存放所有该模块匹配到的loader
        rules.forEach(rule => {
            let { test } = rule;
            if (modulePath.match(test)) {
                loaders.push(...rule.use);
            }
        }); // loaders = [loader1, loader2]
        // loader的执行顺序是从右到左
        sourceCode = loaders.reduceRight((sourceCode, loader) => {
            return require(loader)(sourceCode); // 调用loader方法，参数为模块源代码
        }, sourceCode);
        // 获取当前模块的模块id
        let moduleId = './' + path.posix.relative(basePath, modulePath); // './src/entry1.js'
        let module = { id: moduleId, dependencies: [], name };
        // 7.再找出该模块依赖的模块；递归本步骤直到所有入口依赖的文件都经过本步骤的处理
        let ast = parser.parse(sourceCode, { sourceType: 'module' });
        traverse(ast, {
            CallExpression: ({ node }) => { // 找到所有require方法引入的模块
                if (node.callee.name === 'require') {
                    //获取依赖模块的相对路径 wepback打包后不管什么模块，模块ID都是相对于根目录的相对路径 ./src ./node_modules
                    let depModuleName = node.arguments[0].value; // ./title
                    //获取当前模块的所在的目录
                    let dirname = path.posix.dirname(modulePath); // src的绝对路径
                    // 依赖模块的绝对路径
                    let depModulePath = path.posix.join(dirname, depModuleName);
                    // 模块引入都不会带扩展名（.js/.ts），需要给路径加上扩展名
                    let extensions = this.options.resolve.extensions; // webpack中配置
                    depModulePath = tryExtensions(depModulePath, extensions);
                    // 生成此模块的模块id
                    let depModuleId = './' + path.posix.relative(basePath, depModulePath);
                    // 修改ast语法树中引入模块的路径 ./title => ./src/title.js
                    node.arguments = [types.stringLiteral(depModuleId)];
                    // 将此模块依赖的“模块id”和“模块路径”放到此模块的依赖数组中
                    module.dependencies.push({ depModuleId, depModulePath });
                }
            }
        });
        let { code } = generator(ast); // 根据改造后的ast语法树生成源代码
        module._source = code; // module._source 指向此模块改造后的源码
        // 递归执行
        module.dependencies.forEach(({ depModuleId, depModulePath }) => {
            let depModule = this.buildModule(name, depModulePath);
            this.modules.push(depModule)
        });
        return module;
    }
}
function tryExtensions(modulePath, extensions) {
    if (fs.existsSync(modulePath)) {
        return modulePath;
    }
    for (let i = 0; i < extensions.length; i++) {
        let filePath = modulePath + extensions[i];
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    throw new Error(`${modulePath} not found`);
}
function getSource(chunk) {
    return `
     (() => {
      var modules = {
        ${chunk.modules.map(
        (module) => `
          "${module.id}": (module) => {
            ${module._source}
          },
        `
    )}  
      };
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (cache[moduleId] = {
          exports: {},
        });
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports ={};
      ${chunk.entryModule._source}
    })();
    `;
}
module.exports = Complication;