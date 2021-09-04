const fs = require("fs");

function runLoaders(options, finalCallback) {
    let { resource, loaders = [], context = {}, readResource = fs.readFile } = options;
    let loaderObjects = loaders.map(createLoaderObject); // 将loaders的绝对路径变成对象
    let loaderContext = context; // loader上下文对象，pitch中的this就是这个上下文对象
    loaderContext.resource = resource; // 要加载的资源
    loaderContext.readResource = readResource; // 读取资源的方法
    loaderContext.loaders = loaderObjects; // 所有的loader对象
    loaderContext.loaderIndex = 0; // 当前正在执行的loader索引
    loaderContext.callback = null; // 回调
    loaderContext.async = null; // 把loader的执行从同步变成异步
    // 所有的loader加上resource
    Object.defineProperty(loaderContext, 'request', {
        get() {
            return loaderContext.loaders.map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    //从当前的loader下一个开始一直到结束 ，加上要加载的资源
    Object.defineProperty(loaderContext, 'remainingRequest', {
        get() {
            //loader1!loader2!loader3!index.js
            return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    //从当前的loader开始一直到结束 ，加上要加载的资源
    Object.defineProperty(loaderContext, 'currentRequest', {
        get() {
            //loader1!loader2!loader3!index.js
            return loaderContext.loaders.slice(loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    //从第一个到当前的loader的前一个
    Object.defineProperty(loaderContext, 'previousRequest', {
        get() {
            //loader1!loader2!loader3!index.js
            return loaderContext.loaders.slice(0, loaderContext.loaderIndex).map(loader => loader.path).join('!');
        }
    });
    Object.defineProperty(loaderContext, 'data', {
        get() {
            //loader1!loader2!loader3!index.js
            return loaderContext.loaders[loaderContext.loaderIndex].data;
        }
    });
    /**
     * 使用Object.defineProperty是因为当前执行的loader是变化的，所以需要根据索引的变化动态取值
     */
    let processOptions = {
        resourceBuffer: null, // 将要存放读到的原始文件的内容 index.js的内容
        readResource
    }
    iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
        finalCallback(err, {
            result,
            resourceBuffer: processOptions.resourceBuffer
        })
    })
}
/**
 * 将一个loader从一个绝对路径变成一个loader对象
 * @param {*} loader loader的绝对路径
 */
function createLoaderObject(loader) {
    let normal = require(loader); // 加载loader模块
    let pitch = normal.pitch;
    let raw = normal.raw; // 决定loader的参数是字符串还是buffer
    return {
        path: loader, // 存放此loader的绝对路径
        normal,
        pitch,
        raw,
        data: {}, // 每个loader都可以携带一个自定义的data对象
        pitchExecuted: false, // 此loader的pitch函数是否已经执行过
        normalExecuted: false, // 此loader的normal函数是否已经执行过
    }
}
// pitchingCallback包裹finalCallback，所以pitchCallback会一直往下传递
function iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback) {
    // 所有loader的pitch都已经执行完成
    if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
        return processResource(processOptions, loaderContext, pitchingCallback);
    }
    let currentLoader = loaderContext.loaders[loaderContext.loaderIndex]; // 取出当前loader
    if (currentLoader.pitchExecuted) {
        loaderContext.loaderIndex++; // 如果当前的pitch执行过，就让当前的索引+1
        return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
    }
    let fn = currentLoader.pitch; // 拿到pitch函数，pitch是可有可无的
    currentLoader.pitchExecuted = true; // 表示当前的loader的pitch已经执行过
    if (!fn) {
        return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
    }
    // 以同步或者异步的方式执行pitch
    runSyncOrAsync(fn, loaderContext, [
        loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data
    ], (err, ...args) => {
        // 如果有返回值，索引-1，并执行前一个loader的normal
        if (args.length > 0 && args.some(item => item)) {
            loaderContext.loaderIndex--; // 索引减一
            iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
        } else {
            return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
        }
    });
}
function runSyncOrAsync(fn, loaderContext, args, runCallback) {
    let isSync = true; // 这个是标志符，用来表示fn的执行是同步还是异步，默认同步
    loaderContext.callback = (...args) => {
        runCallback(null, ...args);
    }
    loaderContext.async = () => {
        isSync = false; // 从同步改为异步
        return loaderContext.callback;
    }
    // 在执行pitch函数时，this执行loaderContext
    let result = fn.apply(loaderContext, args);
    if (isSync) { // 如果是同步的执行的话，会立刻向下执行下一个loader
        runCallback(null, result);
    } // 如果是异步的话，那就什么都不要做
}
function processResource(processOptions, loaderContext, pitchingCallback) {
    processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
        processOptions.resourceBuffer = resourceBuffer;
        loaderContext.loaderIndex--; // 定位到最后一个loader
        iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], pitchingCallback);
    })
}
function iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback) {
    if (loaderContext.loaderIndex < 0) {
        return pitchingCallback(null, ...args);
    }
    let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
    if (currentLoader.normalExecuted) {
        loaderContext.loaderIndex--;
        return iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
    }
    let fn = currentLoader.normal;
    currentLoader.normalExecuted = true;
    convertArgs(args, currentLoader.raw);
    runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
        if (err) return pitchingCallback(err);
        return iterateNormalLoaders(processOptions, loaderContext, returnArgs, pitchingCallback);
    })
}
function convertArgs(args, raw) {
    if (raw && !Buffer.isBuffer(args[0])) {
        args[0] = Buffer.from(args[0]);
    } else if (!raw && Buffer.isBuffer(args[0])) {
        args[0] = args[0].toString('utf8');
    }
}
module.exports = {
    runLoaders
}