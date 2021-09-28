const babel = require("@babel/core");
const sourceCode = `<h1 id="title" key="title" ref="title">hello</h1>`;
const result = babel.transform(sourceCode, {
    plugins: [['@babel/plugin-transform-react-jsx',{runtime:'classic'}]]
});
console.log(result.code);

const result2 = babel.transform(sourceCode, {
    plugins: [['@babel/plugin-transform-react-jsx',{runtime:'automatic'}]]
});
console.log(result2.code);

/*
React.createElement("h1", {
    id: "title",
    key: "title",
    ref: "title"
  }, "hello");

  import { jsx as _jsx } from "react/jsx-runtime";
  
  _jsx("h1", {
    id: "title",
    ref: "title",
    children: "hello"
  }, "title");

不难发现新版的react编译走的是_jsx函数，不再使用React.createElement；
所以，如果我们要自己实现React，那么需要禁用新版jsx编译方法，便于我们学习
 */