const config = {
    'port': {
        option: '-p,--port <n>',
        description: 'set server port',
        default: 8080,
        usage: 'zijue-hs -p <n>'
    },
    'directory': {
        option: '-d,--directory <n>',
        description: 'set server directory',
        default: process.cwd(),
        usage: 'zijue-hs -d <n>'
    }
}

module.exports = config