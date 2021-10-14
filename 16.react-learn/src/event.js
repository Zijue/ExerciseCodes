import { updateQueue } from './component';

/**
 * 
 * @param {*} dom 要绑定事件的DOM元素，button
 * @param {*} eventType 事件类型 onclick
 * @param {*} handler 事件处理函数 handleClick
 */
export function addEvent(dom, eventType, handler) {
    //保证dom有store属性，值初始化是一个空对象，store是一个自定义属性
    let store;
    if (dom.store) {
        store = dom.store;
    } else {
        dom.store = {};
        store = dom.store;
    }
    //虽然没有给每个子dom绑定事件，但是事件处理函数还是保存在子dom上
    store[eventType] = handler;
    //将事件委托给document
    //从React-17开始，不再把事件委托给document，而是委托给容器div#root
    if (!document[eventType]) {
        document[eventType] = dispatchEvent;
    }
}
//合成事件的统一处理函数
function dispatchEvent(event) {
    let { target, type } = event; //target=button；type=click
    let eventType = `on${type}`; //onclick
    let syntheticEvent = createSyntheticEvent(event); //创建合成事件对象

    //事件函数执行前先设置批量更新模式为true
    updateQueue.isBatchingUpdate = true; //在事件回调处理函数中更新state，开启批处理（异步）

    //我们需要模拟React事件的冒泡
    while (target) {
        let { store } = target;
        let handler = store && store[eventType];
        handler && handler(syntheticEvent); //执行dom上的事件处理函数
        if (syntheticEvent.isDefaultPrevented) {
            break;
        }
        target = target.parentNode; //向上冒泡
    }

    updateQueue.isBatchingUpdate = false; //事件执行完后，置为false
    updateQueue.batchUpdate();
}
/**
 * 为什么React不把原生事件对象直接传给事件处理函数
 *  1.为了兼容性，抹平浏览器的差异
 * @param {*} nativeEvent 原生事件
 * @returns 
 */
function createSyntheticEvent(nativeEvent) {
    //将原生事件上的属性拷贝到合成事件对象上
    // let syntheticEvent = Object.assign({}, nativeEvent); //不能使用这样的方式，没有成功
    let syntheticEvent = {};
    for (let key in nativeEvent) {
        syntheticEvent[key] = nativeEvent[key];
    }
    syntheticEvent.nativeEvent = nativeEvent; //将原生事件挂到合成事件上
    syntheticEvent.isDefaultPrevented = false;
    syntheticEvent.isPropagationStopped = false;
    syntheticEvent.preventDefault = preventDefault;
    syntheticEvent.stopPropagation = stopPropagation;
    return syntheticEvent;
}
/**
 * 阻止默认事件
 * @param {*} event 原生事件对象
 */
function preventDefault() {
    const event = this.nativeEvent;
    if (!event) { //兼容IE
        window.event.returnValue = false;
    }
    if (event.preventDefault) { //标准浏览器
        event.preventDefault();
    }
    this.isDefaultPrevented = true;
}
function stopPropagation() {
    const event = this.nativeEvent;
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {//IE
        event.cancelBubble = true;
    }
    this.isPropagationStopped = true;
}