// http是node内置模块
const http = require('http');
// request（获取请求的信息）-> response（给浏览器写数据使用response）
// 流：http内部基于tcp（net模块，socket双向通信）http1.1他是一个半双工的（只能我发请求你响应，你不能主动来找我）
// 内部基于socket，将其分割出了request、response底层实现还是要基于socket
const url = require('url');

// 底层基于发布订阅模式
// 底层用socket来通信，http会增加一些header信息，请求来了之后需要在socket中读取数据，并解析成请求头
// 学http就是学header，还有解析请求，响应数据

// url ==> http://username:password@www.zijue.com:80/a?b=1#c
// console.log(url.parse('http://username:password@www.zijue.com:80/a?b=1#c'));

const server = http.createServer((req, res) => {
    console.log('请求来了');
    // ---- 请求行 start ----
    // 先获取请求行、请求方法、请求路径、版本号
    console.log(req.method); // 请求方法是大写
    console.log(req.url); // 请求路径（从路径开始到hash前面，默认没写路径就是/，表示的是服务端根路径）
    console.log(url.parse(req.url));
    // ---- 请求行 end ----
    // ---- 请求头 start ----
    console.log(req.headers); // 获取浏览器的请求头，node中所有的请求头都是小写的
    // ---- 请求头 end ----
    // post 请求和put请求有请求体 req是可读流
    let chunk = [];
    // ---- 读取请求体 start ---- 
    req.on('data', function (data) { // 可读流读取的数据都是buffer类型
        chunk.push(data); // 因为服务端接收到的数据可能是分段传输的，我们需要自己将传输的数据拼接起来
    });
    req.on('end', function () { // 将浏览器发送的数据全部读取完毕
        console.log(Buffer.concat(chunk).toString());
        // ---- 读取请求体 end ---- 
    });

    res.statusCode = 222; // 更改浏览器响应的状态
    res.statusMessage = 'my define';
    res.setHeader('My-Header', 1);
    res.write('hello');
    res.end('ok');
});
// server.on('request', function(req, res){
//     console.log('请求来了');
// })

let port = 3000;
// 每次更新代码需要重新启动服务，才能运行最新代码
server.listen(port, () => {
    console.log('Server start at ' + port);
})
