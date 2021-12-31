import { createHostRootFiber } from './ReactFiber';
import { initializeUpdateQueue } from './ReactUpdateQueue';

export function createFiberRoot(containerInfo) {
    //fiberRoot指的就是容器对象containerInfo div#root
    const fiberRoot = { containerInfo };
    //创建fiber树的根节点
    const hostRootFiber = createHostRootFiber();
    //当前的fiberRoot.current指向这个根fiber
    //current表示当前的意思，指的是跟当前页面中真实dom相同的fiber树
    fiberRoot.current = hostRootFiber;
    //让此根fiber的真实dom节点指向fiberRoot div#root
    hostRootFiber.stateNode = fiberRoot; //stateNode就是指的真实DOM的意思
    //初始化fiber的更新队列，通过pending指向一个链表的数据类型
    initializeUpdateQueue(hostRootFiber);
    return fiberRoot;
}