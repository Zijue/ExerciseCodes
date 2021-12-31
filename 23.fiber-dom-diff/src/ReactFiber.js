import { HostRoot } from './ReactWorkTags';

export function createHostRootFiber() {
    return createFiber(HostRoot);
}
/**
 * 创建fiber节点
 * @param {*} tag fiber的标签，HostRoot指的是根节点
 * @param {*} pendingProps 等待生效的属性对象
 * @param {*} key 
 */
function createFiber(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key);
}
function FiberNode(tag, pendingProps, key) {
    this.tag = tag;
    this.pendingProps = pendingProps;
    this.key = key;
}