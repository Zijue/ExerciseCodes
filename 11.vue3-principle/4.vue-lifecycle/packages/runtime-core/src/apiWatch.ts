import { effect } from "@vue/reactivity";
import { hasChanged } from "@vue/shared";

let postFlushCbs = [];
function queueJob(job) {
    if (!postFlushCbs.includes(job)) {
        postFlushCbs.push(job);
        queueFlush();
    }
}
let isFlushPending = false;
function queueFlush() {
    if (!isFlushPending) {
        isFlushPending = true;
        Promise.resolve().then(flushPostFlushCbs);
    }
}
function flushPostFlushCbs() {
    isFlushPending = false;
    for (let i = 0; i < postFlushCbs.length; i++) {
        postFlushCbs[i]();
    }
    postFlushCbs.length = 0;
}

function dowatch(source, cb, { immediate, flush }) { // immediate是否立即调用，flush表示怎么刷新（核心属性）
    let oldValue;
    const job = () => {
        if (cb) {
            const newValue = runner(); // 获取新值
            if (hasChanged(newValue, oldValue)) { // 如果值有变化，调用对应的callback
                cb(newValue, oldValue);
                oldValue = newValue; // 更新值
            }
        } else { // watchEffect不需要新旧对比
            runner();
        }
    };
    let scheduler;
    if (flush === 'sync') {
        scheduler = job;
    } else if (flush === 'post') { // 批处理，异步更新
        scheduler = () => queueJob(job);
    } else {
        // 其它情况
    }
    let runner = effect(() => source(), {
        lazy: true, // 默认不让effect执行
        scheduler
    });
    if (cb) {
        if (immediate) {
            job(); // 手动调用执行一次回调函数cb
        } else {
            oldValue = runner(); // 不让cb立即执行，也需要获取source的返回值赋给oldValue
        }
    } else { // watchEffect默认会执行一次
        runner();
    }
}
export function watch(source, cb, options) {
    return dowatch(source, cb, options);
}
export function watchEffect(source, options) {
    return dowatch(source, null, options);
}