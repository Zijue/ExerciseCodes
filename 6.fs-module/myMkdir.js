const fs = require('fs');
const path = require('path');

// 创建多级目录 -- 异步方法
function mkdirs(dir, cb){
    exists = fs.existsSync(dir);
    if(exists){
        cb();
    }else{
        mkdirs(path.dirname(dir), function(){
            fs.mkdir(dir, cb);
        })
    }
}

mkdirs('a1/b/e', ()=>{
    console.log('mkdir done');
});
mkdirs('a1/c/f', ()=>{
    console.log('mkdir done');
});
mkdirs('a1/d/g', ()=>{
    console.log('mkdir done');
});
mkdirs('a1/d/h', ()=>{
    console.log('mkdir done');
});
