/**
 * 初始化更新队列
 * 所有的fiber都会等待更新内容放到更新队列中
 * @param {*} fiber 
 */
export function initializeUpdateQueue(fiber) {
    const updateQueue = {
        shared: {
            pending: null
        }
    }
    fiber.updateQueue = updateQueue;
}
export function createUpdate() {
    return {};
}
/**
 * 向当前的fiber的更新队列中添加一个更新
 * @param {*} fiber 
 * @param {*} update 
 */
export function enqueueUpdate(fiber, update) {
    let updateQueue = fiber.updateQueue;
    const sharedQueue = updateQueue.shared;
    const pending = sharedQueue.pending;
    if (!pending) {
        update.next = update; //pending指向null，update.next指向自己
    } else {
        update.next = pending.next;
        pending.next = update;
    }
    sharedQueue.pending = update; //最后修改pending的指向。永远指向最新的那个
}