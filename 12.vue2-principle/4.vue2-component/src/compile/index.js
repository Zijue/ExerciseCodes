import { generate } from "./generate";
import { parserHTML } from "./parser";

export function compileToFunction(html) {
    /**
     * 1.把模板变成ast语法树
     * 2.优化标记静态节点
     * 3.把ast变成render函数
     */
    // 1.把模板变成ast语法树
    const ast = parserHTML(html); // ast抽象语法树，描述html语法本身的
    // console.log(ast);

    // 2.优化标记静态节点
    // vue2中这个功能很弱，就不花时间学习了

    // 3.把ast变成render函数
    const code = generate(ast); // 将ast转换生成一个代码字符串 _c("div",{id:"app",style:{"color":"red"}},[_v("hello,"+_s(name)),_c("span",undefined,[_v(_s(age))])])
    const render = new Function(`with(this){return ${code}}`); // 将字符串包装成函数

    return render;
}