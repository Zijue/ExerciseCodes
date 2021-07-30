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
                patch(null, subTree, container);
                instance.isMounted = true; // 挂载完成
            } else {
                console.log('修改了数据');
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
    const updateElement = (n1, n2, container) => {

    };
    const processElement = (n1, n2, container) => {
        if (n1 == null) {
            mountElement(n2, container);
        } else {
            updateElement(n1, n2, container);
        }
    };
    const processComponent = (n1, n2, container) => {
        if (n1 == null) {
            mountComponent(n2, container); // 创建并挂载组件
        } else {
            updateComponent(n1, n2, container); // 更新组件
        }
    };
    const patch = (n1, n2, container) => {
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
