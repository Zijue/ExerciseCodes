const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // match匹配的是标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 分组里放的就是 "b",'b' ,b  => (b) 3 | 4 | 5
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 <br/>  <div> 
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdasd }}

export function parserHTML(html) {
    // <div id="app">hello, {{name}}<span>{{age}}</span></div>
    // 将解析的标签及文本组成一颗树，通过栈的方式确定父子关系
    let root = null;
    let stack = [];
    function createASTElement(tag, attrs) {
        return {
            tag,
            type: 1,
            attrs,
            children: [],
            parent: null
        }
    }
    function start(tagName, attrs) {
        // console.log(tagName, attrs, '开始标签');
        let element = createASTElement(tagName, attrs);
        if (!root) {
            root = element;
        }
        let parent = stack[stack.length - 1];
        if (parent) {
            element.parent = parent;
            parent.children.push(element);
        }
        stack.push(element); // 入栈
    }
    function chars(text) {
        // console.log(text, '文本');
        let parent = stack[stack.length - 1];
        text = text.replace(/\s/g, ''); // 遇到空格就删除掉
        if (text) {
            parent.children.push({
                text,
                type: 3
            })
        }
    }
    function end(tagName) {
        // console.log(tagName, '结束标签');
        stack.pop(); // 出栈
    }
    while (html) { // html只能有一个根节点
        let textEnd = html.indexOf('<');
        if (textEnd == 0) { // 如果遇到 < 说明可能是开始标签或者结束标签
            const startTagMatch = parseStartTag(html);
            if (startTagMatch) { // 匹配到了开始标签
                start(startTagMatch['tagName'], startTagMatch['attrs']);
                continue;
            }
            // 能走到这一步，说明走到了结束标签
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                end(endTagMatch[1]);
                advance(endTagMatch[0].length);
            }
        }
        let text;
        if (textEnd > 0) { // 文本有可能是空的
            text = html.substring(0, textEnd);
        }
        if (text) {
            chars(text);
            advance(text.length);
        }
    }
    function advance(len) { // 前进方法，用于将匹配过的字符串截取
        html = html.substring(len);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen); // ["<div", "div", index: 0, input: "<div id=\"app\">zijue{{xiaochi}}</div>", groups: undefined]
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length); // 匹配到开始标签之后，删除；然后继续循环匹配开始标签的闭合及属性
            let attr;
            let end; // 结束标签 > or />
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
                advance(attr[0].length);
            }
            advance(end[0].length);
            return match;
            // console.log(html, match);
        }
        return false;
    }
    return root;
}