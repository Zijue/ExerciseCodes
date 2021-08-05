import { effect } from "@vue/reactivity";
import { invokeArrayFns, ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component";

let queue = [];
function queueJob(job) { // 批量处理；多次更新先缓存去重，之后异步更新。这里的job就是更新数据后需要执行的effect
    if (!queue.includes(job)) {
        queue.push(job);
        queueFlush(); // 执行清空任务队列函数，每次都去调用，但是执行器是一个promise，它会等当前同步宏任务执行完成后才执行
    }
}
let isFlushPending = false; // 批处理阻塞
function queueFlush() {
    if (!isFlushPending) { // 保证只执行一次
        isFlushPending = true;
        Promise.resolve().then(flushJobs); // promise会在任务队列添加完成后才执行
    }
}
function flushJobs() {
    isFlushPending = false;
    queue.sort((a, b) => a.id - b.id); // 排序保证组件执行，先父后子
    for (let i = 0; i < queue.length; i++) {
        queue[i]();
    }
    queue.length = 0; // 执行完成后，任务队列需要清空
}

export function createRenderer(rendererOptions) { // 不再关心是什么平台，dom操作的方法由runtime-dom传入
    const { // 按照Vue3中的源码对DOM操作重命名
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
    } = rendererOptions;
    const setupRenderEffect = (instance, container) => {
        effect(() => { // 每次状态变化后，都会重新执行effect
            if (!instance.isMounted) {
                // console.log('第一次渲染');

                let { bm, m } = instance;
                if (bm) {
                    invokeArrayFns(bm);
                }

                // 组件渲染的内容就是subTree
                let subTree = instance.render.call(instance.proxy, instance.proxy); // 调用render，render需要获取数据
                // 将subTree赋值给instance.subTree，等数据更新后做diff算法用
                instance.subTree = subTree;
                patch(null, subTree, container); // 渲染子树；即render返回的是h函数创建的虚拟节点：h('div', {}, 'hi, zijue')
                instance.isMounted = true; // 挂载完成

                if (m) {
                    invokeArrayFns(m);
                }
            } else {
                let { bu, u } = instance;
                if (bu) {
                    invokeArrayFns(bu);
                }

                const prevTree = instance.subTree; // 获取数据没变时（初始化时组件的）subTree
                // 再次调用render，此时使用的是最新的数据渲染
                const nextTree = instance.render.call(instance.proxy, instance.proxy);
                instance.subTree = nextTree; // 将新的subTree赋给instance.subTree供后续更新使用
                // 执行diff算法
                patch(prevTree, nextTree, container);

                if (u) {
                    invokeArrayFns(u);
                }
            }
        }, {
            scheduler: queueJob
        })
    };
    const mountComponent = (n2, container) => {
        // 1.组件的创建，需要产生一个组件的实例，调用组件实例上的setup方法拿到render函数，再调用render函数，拿到组件对应（要渲染的内容）的虚拟DOM、subTree
        let instance = n2.component = createComponentInstance(n2); // 根据虚拟节点创造一个实例
        // 2.给instance增加属性，调用setup拿到里面的信息
        setupComponent(instance);
        // 3.调用实例中的render方法；每个组件都有一个effect
        setupRenderEffect(instance, container);
    };
    const mountChildren = (children, container) => {
        for (let i = 0; i < children.length; i++) {
            patch(null, children[i], container);
        }
    };
    const updateComponent = (n1, n2, container) => {

    };
    const mountElement = (n2, container, anchor) => { // 把虚拟节点变成真实的DOM元素
        const { type, props, children, shapeFlag } = n2;
        let el = n2.el = hostCreateElement(type); // 创建对应真实的DOM元素
        if (props) {
            for (let key in props) {
                hostPatchProp(el, key, null, props[key]);
            }
        };
        // 父节点创建完，需要继续创建儿子
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el);
        } else {
            hostSetElementText(el, children);
        };
        // 最后将父节点挂载到container上
        hostInsert(el, container, anchor);
    };
    const patchProps = (el, oldProps, newProps) => {
        // 两个循环，第一次循环遍历新属性更新到旧节点上，第二次循环遍历旧属性清空新属性中没有的项
        if (oldProps !== newProps) {
            for (let key in newProps) {
                const prev = oldProps[key];
                const next = newProps[key];
                if (prev !== next) {
                    hostPatchProp(el, key, prev, next);
                }
            };
            for (let key in oldProps) {
                if (!(key in newProps)) {
                    hostPatchProp(el, key, oldProps[key], null);
                }
            }
        }
    };
    const unmountChildren = (children) => {
        for (let i = 0; i < children.length; i++) {
            unmount(children[i]);
        }
    };
    const patchKeyedChildren = (c1, c2, container) => {
        // diff 算法
        let i = 0; // 新旧子节点默认都是从头开始比对
        let e1 = c1.length - 1; // 旧子节点最后一个元素的下标
        let e2 = c2.length - 1; // 新子节点最后一个元素的下标
        // sync from start  从头开始一个个比，遇到不同的就停止
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSameVnode(n1, n2)) { // 是同一个元素，继续对比这两个子节点的属性和子节点
                patch(n1, n2, container);
            } else { // 不同直接跳出循环，然后从尾部对比
                break;
            }
            i++;
        }
        // sync from end    从尾开始一个个比，一样是遇到不同的就停止
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSameVnode(n1, n2)) {
                patch(n1, n2, container);
            } else {
                break;
            }
            e1--;
            e2--;
        }
        // 有一方已经完全对比完成了，diff算法的特殊情况对比
        if (i > e1) { // common sequence + mount    老的少，新的多，说明是新增
            if (i <= e2) { // 表示有新增的部分
                // 如何判断是添加到尾部还是插入到前面？
                // 判断 e2 + 1 与 c2.length 的大小；如果向后追加 e2 + 1 > c2.length 肯定成立
                const nextPos = e2 + 1;
                const anchor = nextPos < c2.length ? c2[nextPos].el : null; // 获取插入位置节点
                while (i <= e2) {
                    patch(null, c2[i++], container, anchor);
                }
            }
        } else if (i > e2) { // common sequence + unmount   老的多，新的少
            while (i <= e1) { // 表示有需要删除的部分
                unmount(c1[i++]);
            }
        } else { // 乱序比对（最长递增子序列）  diff核心算法
            // A B [C D E Q] F G
            // A B [E C D H] F G
            // i = 2, e1 = 5, e2 = 5
            const s1 = i;
            const s2 = i;
            // 1.根据新节点生成一个索引的映射表
            const keyToNewIndexMap = new Map();
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i];
                keyToNewIndexMap.set(nextChild.key, i);
            }
            // console.log(keyToNewIndexMap); // {"E" => 2, "C" => 3, "D" => 4, "H" => 5}
            // 2.有了映射表之后，需要知道哪些可以被patch，哪些不能，哪些需要删除
            // 2.1.计算有几个新节点需要被patch
            const toBePatched = e2 - s2 + 1; // 4
            // 2.2.创建一个与需要patch等长的数组，用0填充
            const newIndexToOldIndexMap = new Array(toBePatched).fill(0); // [0, 0, 0, 0]
            // 2.3.遍历老节点，删除新节点中没有的，更新能复用元素并标记已patch
            for (let i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                const newIndex = keyToNewIndexMap.get(prevChild.key); // 获取老节点在新节点中的下标索引
                if (newIndex == undefined) { // 老节点中有，新节点中没有的，直接删除
                    unmount(prevChild);
                } else {
                    // 将patch过的新节点对应下标与该节点在老节点中的位置一一映射（构建新老索引的关系）；
                    // 映射完成后，值为0表示该新节点未patch即老节点中没有
                    newIndexToOldIndexMap[newIndex - s2] = i + 1; // [5, 3, 4, 0]
                    patch(prevChild, c2[newIndex], container); // 更新相同元素的属性与子节点
                }
            }
            // 2.4.求解最长递增子序列
            // 这里是求解[5, 3, 4, 0]的最长递增子序列，即求解不需要移动的元素有哪些
            let increasingNewIndexSeq = getSeq(newIndexToOldIndexMap); // [1, 2]
            let j = increasingNewIndexSeq.length - 1; // 取出最后一个的索引
            for (let i = toBePatched - 1; i >= 0; i--) {
                let currentIndex = i + s2; // 获取h节点的位置
                let childNode = c2[currentIndex];
                let anchor = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
                // 如果以前不存在这个节点就创造出来，再进行插入操作
                if (newIndexToOldIndexMap[i] == 0) {
                    patch(null, childNode, container, anchor);
                } else {
                    if (increasingNewIndexSeq[j] !== i) {
                        hostInsert(childNode.el, container, anchor); // 存在直接将节点进行插入操作
                        // dom操作是具有移动性的，用的是以前的元素，但是都做了一遍重新插入
                    } else {
                        j--;
                    }
                }
            }
        }
    };
    const getSeq = (arr) => {
        const len = arr.length;
        const result = [0]; // 用来存放最长递增子序列的索引
        const p = arr.slice(0); // 用来存索引，用于记录自己前一个节点的下标
        let resultLastIndex;

        for (let i = 0; i < len; i++) {
            const arrI = arr[i]; // 获取数组中的每一项，但是其中值为0是无意义，需要忽略
            if (arrI !== 0) {
                resultLastIndex = result[result.length - 1];
                // 索引数组中最后一个对应的数组的值与当前数组拿出来的值进行对比，
                // arr[resultLastIndex] < arrI，将当前的索引添加到索引数组result中
                if (arr[resultLastIndex] < arrI) {
                    p[i] = resultLastIndex; // 在放入之前记住前一个的索引
                    result.push(i);
                    continue; // 如果是比最后一项大，后续逻辑就不用走了
                }
                // 二分查找，找到已存入索引数组中对应的值第一个大于当前数组下标对应的值的下标
                let start = 0;
                let end = result.length - 1;
                let middle;
                while (start < end) { // 最终start == end
                    middle = ((start + end) / 2) | 0; // 向下取整
                    if (arr[result[middle]] < arrI) {
                        start = middle + 1;
                    } else {
                        end = middle;
                    }
                }
                if (arrI < arr[result[start]]) {
                    if (start > 0) {
                        p[i] = result[start - 1]; // 替换的时候记录我替换那个的前一个的索引
                    }
                    result[start] = i; // 直接用当前的索引替换到老的索引
                }
            }
        }
        // 从结果的最后一项开始，倒序查找回来
        let r_len = result.length;
        let last = result[r_len - 1];
        while (r_len-- > 0) {
            result[r_len] = last;
            last = p[last]; // 通过最后一项倒序查找
        }
        return result;
    };
    const patchChildren = (n1, n2, container) => {
        const c1 = n1.children;
        const c2 = n2.children;
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        // 1.新子节点是文本，直接新的替换旧的
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 旧子节点是数组，先删除
                unmountChildren(c1);
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2); // 直接替换
            }
        } else { // 新子节点是数组
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 3.新旧子节点都是数组
                patchKeyedChildren(c1, c2, container);
            } else { // 2.新子节点是数组，旧子节点是文本
                hostSetElementText(container, ''); // 先将父节点清空
                mountChildren(c2, container); // 然后挂载新的子节点
            }
        }
    };
    const patchElement = (n1, n2, container) => { // 走到这里说明前后两个元素能够复用
        let el = n2.el = n1.el; // 复用DOM

        const oldProps = n1.props || {};
        const newProps = n2.props || {};
        patchProps(el, oldProps, newProps); // 更新属性
        patchChildren(n1, n2, el); // 更新子节点；diff算法
    };
    const processElement = (n1, n2, container, anchor) => {
        if (n1 == null) {
            mountElement(n2, container, anchor);
        } else { // patch方法中对不同节点进行了处理，能走到这里说明n1、n2是相同节点，只是属性或子节点不同
            patchElement(n1, n2, container); // diff算法
        }
    };
    const processComponent = (n1, n2, container) => {
        if (n1 == null) {
            mountComponent(n2, container); // 创建并挂载组件
        } else {
            updateComponent(n1, n2, container); // 更新组件
        }
    };
    const isSameVnode = (n1, n2) => {
        return n1.type === n2.type && n1.key === n2.key;
    };
    const unmount = (vnode) => {
        hostRemove(vnode.el);
    };
    const patch = (n1, n2, container, anchor = null) => {
        // 判断n1、n2是否为同一个元素；通过type和key判断
        if (n1 && !isSameVnode(n1, n2)) { // 如果type和key不一样则直接删除老节点后渲染新节点
            unmount(n1);
            n1 = null; // 如果n1为空，则直接重新渲染n2
        }

        const { shapeFlag } = n2; // n2 可能是元素或者组件，不同的类型走不同的处理逻辑
        if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(n1, n2, container, anchor); // 处理元素类型
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(n1, n2, container); // 处理组件类型
        }
    };
    const render = (vnode, container) => {
        // console.log('render: ', vnode, container);
        patch(null, vnode, container); // 初始化逻辑，老的虚拟节点为null；后续更新还有更新逻辑
    };
    return {
        createApp: createAppAPI(render),
        render
    }
}
