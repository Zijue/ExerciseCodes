const fs = require('fs').promises;
const path = require('path');

// 递归删除文件夹
// 1.异步串行 -- 深度优先
// function myRmdir(dir, callback) {
//     fs.stat(dir, (err, statObj) => {
//         if (statObj.isFile()) {
//             fs.unlink(dir, callback); // 如果是文件直接删除即可
//         } else {
//             fs.readdir(dir, (err, dirs) => {
//                 if (dirs.length != 0) {
//                     // 1.读取所有的子节点路径
//                     dirs = dirs.map(d => path.join(dir, d));
//                 }
//                 // 2.依次拿出子节点进行删除操作
//                 let idx = 0;
//                 function next() {
//                     // 3.当前节点索引与子节长度相同时，表示子节点已删除完毕
//                     if (idx == dirs.length) return fs.rmdir(dir, callback);
//                     let current = dirs[idx++];
//                     myRmdir(current, next);
//                 }
//                 next();
//             })
//         }
//     })
// }

// 2.异步串行 -- 广度优先
// function myRmdir(dir, callback) {
//     stack = [dir];
//     function reverseRemove() {
//         let idx = stack.length - 1;
//         function next() {
//             if (idx < 0) return callback();
//             let current = stack[idx--];
//             fs.rmdir(current, next);
//         }
//         next();
//     }
//     fs.stat(dir, (err, statObj) => {
//         if (statObj.isFile()) {
//             fs.unlink(dir, callback); // 如果是文件直接删除即可
//         } else {
//             // 如果是目录，采用广度遍历的方式
//             // 采用异步的方式读取目录，维护想要的结果，最终将结果倒序删除
//             let idx = 0;
//             function next() {
//                 let dir = stack[idx++];
//                 if (!dir) return reverseRemove();
//                 fs.readdir(dir, (err, dirs) => {
//                     if (dirs.length != 0) {
//                         dirs = dirs.map(d => path.join(dir, d));
//                     }
//                     stack.push(...dirs);
//                     next();
//                 })
//             }
//             next();
//         }
//     })
// }

// 3.并发删除
// function myRmdir(dir, callback) {
//     fs.stat(dir, (err, statObj) => {
//         if (statObj.isFile()) {
//             fs.unlink(dir, callback); // 如果是文件直接删除即可
//         } else {
//             // 如果是文件夹，同时删除子节点（如果子节点为空则需要删除自己）
//             fs.readdir(dir, (err, dirs) => {
//                 if (dirs.length != 0) {
//                     dirs = dirs.map(d => path.join(dir, d));
//                 } else {
//                     return fs.rmdir(dir, callback); // 没有子节点，删除自身
//                 }
//                 let idx = 0;
//                 function removeCount() {
//                     if (++idx == dirs.length) {
//                         fs.rmdir(dir, callback);
//                     }
//                 }
//                 dirs.forEach(dir => {
//                     myRmdir(dir, removeCount);
//                 })
//             })
//         }
//     })
// }

// myRmdir('a1', () => {
//     console.log('删除完成');
// });

// 4.promises优化
// function myRmdir(dir) {
//     return new Promise((resolve, reject) => {
//         fs.stat(dir, (err, statObj) => {
//             if (err) reject(err);
//             if (statObj.isFile()) {
//                 fs.unlink(dir, resolve);
//             } else {
//                 fs.readdir(dir, (err, dirs) => {
//                     if (err) reject(err);
//                     // map 返回的是删除子节点列表的promise数据
//                     if (dirs.length != 0) {
//                         dirs = dirs.map(d => myRmdir(path.join(dir, d)));
//                     }
//                     Promise.all(dirs).then(() => {
//                         fs.rmdir(dir, resolve);
//                     }).catch(err => {
//                         reject(err);
//                     })
//                 })
//             }
//         })
//     })
// }

// 5.async + await
async function myRmdir(dir) {
    let statObj = await fs.stat(dir); // statObj | 不存在则报错
    if (statObj.isDirectory()) {
        let dirs = await fs.readdir(dir); // 返回的是一个数组
        // 使用Promise.all将所有子文件包裹起来进行删除
        await Promise.all(dirs.map(d => myRmdir(path.join(dir, d))));
        await fs.rmdir(dir);
    } else {
        await fs.unlink(dir);
    }
}

myRmdir('a1').then(() => {
    console.log('删除成功');
}).catch(err => {
    console.log('删除失败', err);
})
