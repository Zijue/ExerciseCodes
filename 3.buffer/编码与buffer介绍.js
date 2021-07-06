/* 进制表示十进制数 255
0b11111111  二进制
0o377       八进制
0xff        十六进制
*/

// 把任意进制转成 10 进制
console.log(parseInt('11111111', 2)); // 255
// 把任意进制转成任意进制
console.log((0xff).toString(2)); // 11111111

// | & << 针对 2 进制
// << 左位移表示平方
console.log(1 << 2); // 左移两位，相当于 1 * 2^2 = 4
// | 或，比较每个 bit，只要有一个 bit 是 1 就为 1
// 0110 | 1100 = 1110
console.log(0b0110 | 0b1100, 0b1110); // 14 14
// & 与，比较每个 bit，只要 bit 全是 1 才为 1
// 0110 & 1100 = 0100
console.log(0b0110 & 0b1100, 0b0100); // 4 4

// base64编码（没有加密功能）

// node.js 中字符编码为 utf-8
// 一个汉字的编码为三个字节（24 位），比较偏门的会用到 4 个字节
// 把一个汉字转化成 2 进制（表现形式是 16 进制）
console.log(Buffer.from('池')); // <Buffer e6 b1 a0>
console.log((0xe6).toString(2)); // 11100110
console.log((0xb1).toString(2)); // 10110001
console.log((0xa0).toString(2)); // 10100000
// 池 ==> 11100110 10110001 10100000
// base64 00111001 00101011 00000110 00100000  base64转化后的结果会比之前大 1/3
console.log(parseInt(0b00111001)); // 57
console.log(parseInt(0b00101011)); // 43
console.log(parseInt(0b00000110)); // 6
console.log(parseInt(0b00100000)); // 32
// 57 43 6 32
let AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let az = AZ.toLowerCase();
let base64MapStr = AZ + az + '0123456789+/'; // 合计 64 个字符
// 池 ==> base64 就是将转换后的值对 base64 映射字符串下标取值，然后拼接成新的可以显示的字符串
console.log(base64MapStr[57] + base64MapStr[43] + base64MapStr[6] + base64MapStr[32]); // 5rGg

// Buffer 代表的是 node 中的二进制（表现给我们的是 16 进制）的内存，大小不能随便更改
let buf1 = Buffer.alloc(10); // node 中的最小单位都是字节，表示申请 10 字节内存空间
let buf2 = Buffer.from([1,2,10,22,18]); // 不常用，表示申请 5 个字节内存空间（数组中数组转换成 16 进制存储）
let buf3 = Buffer.from('小池'); // 首先将‘小池’转换为二进制总共 6 个字节，然后申请 6 个字节内存空间将数据存进去
console.log(buf1, buf2, buf3); // <Buffer 00 00 00 00 00 00 00 00 00 00> <Buffer 01 02 0a 16 12> <Buffer e5 b0 8f e6 b1 a0>

// Buffer 的特点：字节长度，声明后长度不能更改
console.log(buf3.length); // 6
// Buffer 可以和字符串任意转换
console.log(buf3.toString()); // 小池（默认按照 utf-8 编码）
console.log(buf3.toString('utf-8')); // 小池
// 还可以转换成 base64，不支持 gbk
console.log(buf3.toString('base64')); // 5bCP5rGg

// iconv-lite 处理 node 默认不支持的编码，例如 gbk 编码