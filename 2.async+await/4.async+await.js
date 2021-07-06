let fs = require('fs').promises;

async function read() {
    try {
        const a = await fs.readFile('a.txt', 'utf8');
        const b = await fs.readFile(a, 'utf8');
        return b;
    } catch (e) {
        console.log(e);
    }
}

read().then(data => {
    console.log('success', data);
}, err => {
    console.log(err);
})


// try{
//     fs.readFile('a1.txt', 'utf8')
// }catch(e){
//     console.log(e);
// }
