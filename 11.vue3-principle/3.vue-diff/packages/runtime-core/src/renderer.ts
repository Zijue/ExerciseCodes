import { effect } from "@vue/reactivity";
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component";

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
                // 组件渲染的内容就是subTree
                let subTree = instance.render.call(instance.proxy, instance.proxy); // 调用render，render需要获取数据
                // 将subTree赋值给instance.subTree，等数据更新后做diff算法用
                instance.subTree = subTree;
                patch(null, subTree, container); // 渲染子树；即render返回的是h函数创建的虚拟节点：h('div', {}, 'hi, zijue')
                instance.isMounted = true; // 挂载完成
            } else {
                const prevTree = instance.subTree; // 获取数据没变时（初始化时组件的）subTree
                // 再次调用render，此时使用的是最新的数据渲染
                const nextTree = instance.render.call(instance.proxy, instance.proxy);
                instance.subTree = nextTree; // 将新的subTree赋给instance.subTree供后续更新使用
                // 执行diff算法
                patch(prevTree, nextTree, container);
            }
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
    const mountElement = (n2, container) => { // 把虚拟节点变成真实的DOM元素
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
        hostInsert(el, container);
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
    const patchKeyedChildren = (c1, c2, container) => {
        // diff 算法
    };
    const patchChildren = (n1, n2, container) => {
        const c1 = n1.children;
        const c2 = n2.children;
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        // 1.新子节点是文本，直接新的替换旧的
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(container, c2); // 直接替换
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
    const processElement = (n1, n2, container) => {
        if (n1 == null) {
            mountElement(n2, container);
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
    const patch = (n1, n2, container) => {
        // 判断n1、n2是否为同一个元素；通过type和key判断
        if (n1 && !isSameVnode(n1, n2)) { // 如果type和key不一样则直接删除老节点后渲染新节点
            unmount(n1);
            n1 = null; // 如果n1为空，则直接重新渲染n2
        }

        const { shapeFlag } = n2; // n2 可能是元素或者组件，不同的类型走不同的处理逻辑
        if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(n1, n2, container); // 处理元素类型
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
