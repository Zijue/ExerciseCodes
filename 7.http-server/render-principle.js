function anonymous(obj) {
    let str = '';
    with (obj) {
        str += `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        
        <body>
        `
        arr.forEach(item => {
            str += `
            ${item}
            `
        });
        str += `
        </body>
        </html>`
        return str
    }
}

let r = anonymous({ arr: [1, 2, 3, 4, 5] });
console.log(r);
