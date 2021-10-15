import { MOVE, PLACEMENT, REACT_FORWARD_REF, REACT_TEXT, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO } from "./constants";
import { addEvent } from "./event";

/**
 * 将虚拟dom渲染挂载到指定的真实dom容器上
 * @param {*} vdom 虚拟dom，即React元素
 * @param {*} container 真实dom容器
 */
function render(vdom, container) {
    mount(vdom, container); //挂载方法
}
function mount(vdom, container) {
    //把虚拟DOM变成真实DOM
    let newDOM = createDOM(vdom); //有可能会返回null，需要做处理
    //把真实DOM追加到容器上
    if (newDOM) container.appendChild(newDOM);

    if (newDOM && newDOM.componentDidMount) {
        newDOM.componentDidMount();
    }
}
/**
 * 把虚拟dom变成真实dom
 * @param {*} vdom 虚拟dom
 * @returns 真实dom
 */
function createDOM(vdom) {
    let { type, props, ref } = vdom;
    let dom; //真实dom
    if (type && type.$$typeof === REACT_MEMO) {
        return mountMemoComponent(vdom);
    } else if (type && type.$$typeof === REACT_PROVIDER) {
        return mountProviderComponent(vdom);
    } else if (type && type.$$typeof === REACT_CONTEXT) {
        return mountContextComponent(vdom);
    } else if (type && type.$$typeof === REACT_FORWARD_REF) {
        return mountForwardComponent(vdom); //挂载ref转发组件
    } else if (type === REACT_TEXT) { //创建文本节点
        dom = document.createTextNode(props.content);
    } else if (typeof type === 'function') { //函数组件/类组件（类最后都会编译成函数）
        if (type.isReactComponent) { //类组件
            return mountClassComponent(vdom);
        } else { //函数组件
            return mountFunctionComponent(vdom);
        }
    } else { //创建dom节点：span、h1、div、p等
        dom = document.createElement(type);
    }
    if (props) {
        //更新dom的属性
        updateProps(dom, {}, props);
        let children = props.children;
        //如果儿子是一个对象，且有type属性，说明是React元素，需要挂载
        if (typeof children === 'object' && children.type) {
            mount(children, dom);
        } else if (Array.isArray(children)) {
            reconcilChildren(children, dom);
        }
    }
    vdom.dom = dom; //在虚拟dom挂载或者说放置一个dom属性指向此虚拟dom对应的真实dom
    if (ref) ref.current = dom;
    return dom;
}
function mountMemoComponent(vdom) {
    let { type, props } = vdom; //type={$$typeof: REACT_MEMO, compareFn, type:FunctionCounter}
    let renderVdom = type.type(props);
    //vdom.prevProps = props;这一步非常关键
    vdom.prevProps = props; //记录一下老的属性对象，方便后续更新的时候进行对比
    vdom.oldRenderVdom = renderVdom;
    if (!renderVdom) return null; //有可能renderVdom是没有返回值的，如portal
    return createDOM(renderVdom);
}
function mountProviderComponent(vdom) {
    let { type, props } = vdom; //type = {$$typeof: Symbol(react.provider), _context: context}
    let context = type._context; //{ $$typeof: REACT_CONTEXT, _currentValue: undefined }
    context._currentValue = props.value; //把属性中的value值赋给context._currentValue
    let renderVdom = props.children; //Provider实际要渲染的是它的儿子
    vdom.oldRenderVdom = renderVdom; //这一步是为了后面更新用
    if (!renderVdom) return null;
    return createDOM(renderVdom);
}
function mountContextComponent(vdom) {
    let { type, props } = vdom; //type = {$$typeof: Symbol(react.context), _context: context}
    let context = type._context;
    //Consumer实际也是要渲染儿子，且儿子是个函数，参数为Provider中value值(赋给了context._currentValue)
    let renderVdom = props.children(context._currentValue);
    vdom.oldRenderVdom = renderVdom;
    if (!renderVdom) return null;
    return createDOM(renderVdom);
}
function mountForwardComponent(vdom) {
    let { type, props, ref } = vdom;
    let renderVdom = type.render(props, ref);
    if (!renderVdom) return null; //有可能renderVdom是没有返回值的，如portal
    return createDOM(renderVdom);
}
function mountFunctionComponent(vdom) { //挂载函数组件
    let { type: functionComponent, props } = vdom;
    let renderVdom = functionComponent(props); //执行函数组件的函数，获取需要渲染的虚拟dom返回值
    vdom.oldRenderVdom = renderVdom; //记录老的渲染虚拟dom，供后续diff用
    if (!renderVdom) return null; //有可能renderVdom是没有返回值的，如portal
    return createDOM(renderVdom);
}
function mountClassComponent(vdom) { //挂载类组件
    let { type: ClassComponent, props, ref } = vdom;
    let classInstance = new ClassComponent(props); //创建类组件的实例

    //把Provider中的value值赋给classInstance（类组件实例）的context属性
    if (ClassComponent.contextType) {
        classInstance.context = ClassComponent.contextType._currentValue;
    }

    vdom.classInstance = classInstance; //在虚拟DOM上挂载一个属性，指向类组件的实例，用于类组件的更新时使用

    if (ref) ref.current = classInstance; //类组件的ref指向类组件的实例

    if (classInstance.componentWillMount) { //调用生命周期函数
        classInstance.componentWillMount();
    }

    let renderVdom = classInstance.render(); //调动实例的render方法
    vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom; //将类组件实例与老的虚拟DOM关联
    if (!renderVdom) return null; //有可能renderVdom是没有返回值的，如portal
    // return createDOM(renderVdom);
    let dom = createDOM(renderVdom);
    if (classInstance.componentDidMount) {
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
    }
    return dom;
}
function reconcilChildren(children, parentDOM) {
    children.forEach(childVdom => mount(childVdom, parentDOM));
}
function updateProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') { //此处不处理子节点
            continue;
        } else if (key === 'style') {
            let styleObj = newProps[key];
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr];
            }
        } else if (/^on[A-Z].*/.test(key)) { //说明是一个事件处理函数
            //DOM.onclick = 事件处理函数;
            // dom[key.toLowerCase()] = newProps[key];
            addEvent(dom, key.toLowerCase(), newProps[key]);
        } else {
            dom[key] = newProps[key];
        }
    }
    for (let key in oldProps) {
        //老的有，新的没有，需要删除
        if (!newProps.hasOwnProperty(key)) {
            dom[key] = null;
        }
    }
}
/**
 * DOM-DIFF，递归比较，老的虚拟dom和新的虚拟dom，找出新旧的差异，然后把这些差异用最小化的操作同步到真实dom上
 * @param {*} parentDOM 父真实DOM
 * @param {*} oldVdom 老的虚拟DOM
 * @param {*} newVdom 新的虚拟DOM
 * @param {*} nextDOM 你将把新的元素插入到哪个真实DOM之前
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
    // let oldDOM = oldVdom.dom;
    // let oldDOM = findDOM(oldVdom);
    // let newDOM = createDOM(newVdom);
    // parentDOM.replaceChild(newDOM, oldDOM); //直接替换的方式太暴力

    if (!oldVdom && !newVdom) { //新老都为null，什么都不干
        return;
    } else if (oldVdom && !newVdom) { //老的有，新的没有，删除老节点
        unMountVdom(oldVdom);
    } else if (!oldVdom && newVdom) { //老的没有，新的有
        mountVdom(parentDOM, newVdom, nextDOM);
    } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
        //新老都有，判断类型type，如果类型一样，可以复用，如果不一样，不能复用
        unMountVdom(oldVdom);
        mountVdom(parentDOM, newVdom, nextDOM);
    } else { //新老都有，且类型一样，可复用当前的DOM节点，同时进行深度的dom-diff
        updateElement(oldVdom, newVdom);
    }
}
function updateElement(oldVdom, newVdom) {
    if (oldVdom.type.$$typeof === REACT_MEMO) {
        updateMemoComponent(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
        updateProviderComponent(oldVdom, newVdom);
    } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
        updateContextComponent(oldVdom, newVdom);
    } else if (oldVdom.type === REACT_TEXT) { //如果新老节点都是文本节点，复用老的文本节点
        let currentDOM = newVdom.dom = findDOM(oldVdom);
        currentDOM.textContent = newVdom.props.content;
    } else if (typeof oldVdom.type === 'string') { //原生组件 div/h1等
        let currentDOM = newVdom.dom = findDOM(oldVdom); //复用DOM
        updateProps(currentDOM, oldVdom.props, newVdom.props); //更新属性
        //更新子节点，dom-diff核心
        updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    } else if (typeof oldVdom.type === 'function') { //类组件或者函数组件
        if (oldVdom.type.isReactComponent) { //类组件
            newVdom.classInstance = oldVdom.classInstance;
            updateClassComponent(oldVdom, newVdom); //更新类组件
        } else { //函数组件
            updateFunctionComponent(oldVdom, newVdom);
        }
    }
}
function updateMemoComponent(oldVdom, newVdom) {
    let { type, prevProps } = oldVdom;
    //新老属性对比，不相等则更新
    if (!type.compareFn(prevProps, newVdom.props)) { //更新
        let oldDOM = findDOM(oldVdom);
        let parentDOM = oldDOM.parentNode;
        let { type, props } = newVdom;
        let renderVdom = type.type(props);
        compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
        newVdom.prevProps = props;
        newVdom.oldRenderVdom = renderVdom;
    } else { //跳过更新，直接赋值
        newVdom.prevProps = prevProps;
        newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    }
}
function updateProviderComponent(oldVdom, newVdom) {
    let oldDOM = findDOM(oldVdom); //老的真实DOM
    let parentDOM = oldDOM.parentNode; //真实父DOM
    let { type, props } = newVdom;
    let context = type._context;
    /**
     * 这一步相当关键，使用新的value属性赋给context._currentValue，供后续使用
     */
    context._currentValue = props.value;
    let renderVdom = props.children;
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}
function updateContextComponent(oldVdom, newVdom) {
    let oldDOM = findDOM(oldVdom); //老的真实DOM
    let parentDOM = oldDOM.parentNode; //真实父DOM
    let { type, props } = newVdom;
    let context = type._context;
    let renderVdom = props.children(context._currentValue);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}
/**
 * 更新子节点
 * @param {*} parentDOM 父节点真实DOM
 * @param {*} oldVChildren 老的虚拟子节点
 * @param {*} newVChildren 新的虚拟子节点
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
    //过滤其中空的子节点，undefined
    oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]).filter(item => item);
    newVChildren = (Array.isArray(newVChildren) ? newVChildren : [newVChildren]).filter(item => item);
    // let maxLength = Math.max(oldVChildren.length, newVChildren.length);
    // for (let i = 0; i < maxLength; i++) {
    //     let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item));
    //     compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVdom && findDOM(nextVdom));
    // }

    //1.构建老的子节点映射，key：虚拟DOM的key 值：虚拟DOM
    let keyedOldMap = {};
    oldVChildren.forEach((oldVChild, index) => {
        let oldKey = oldVChild.key ? oldVChild.key : index;
        keyedOldMap[oldKey] = oldVChild;
    });
    let patch = []; //表示我们要打的补丁，也就是我们要进行的操作
    let lastPlacedIndex = 0;
    //2.标记那些节点需要移动，那些节点是新插入的
    newVChildren.forEach((newVChild, index) => {
        newVChild.mountIndex = index;
        let newKey = newVChild.key ? newVChild.key : index;
        let oldVChild = keyedOldMap[newKey];
        if (oldVChild) { //新节点存在于老节点中，表示可以复用老节点
            //先更新
            updateElement(oldVChild, newVChild);
            if (oldVChild.mountIndex < lastPlacedIndex) {
                patch.push({
                    type: MOVE,
                    oldVChild, //把oldVChild移动到当前的索引出
                    newVChild,
                    mountIndex: index
                });
            }
            delete keyedOldMap[newKey]; //从Map中删除已经复用好的节点
            lastPlacedIndex = Math.max(oldVChild.mountIndex, lastPlacedIndex);
        } else {
            patch.push({
                type: PLACEMENT,
                newVChild,
                mountIndex: index
            })
        }
    });
    //3.获取需要移动的节点
    let moveChildren = patch.filter(action => action.type === MOVE).map(action => action.oldVChild);
    //4.先删除移动的和需要删除的节点
    //遍历完成后再map留下的节点就是没有被复用到的元素，需要全部删除
    Object.values(keyedOldMap).concat(moveChildren).forEach(oldVChild => {
        let currentDOM = findDOM(oldVChild);
        parentDOM.removeChild(currentDOM);
    });
    patch.forEach(action => {
        let { type, oldVChild, newVChild, mountIndex } = action;
        let childNodes = parentDOM.childNodes; //真实DOM节点集合
        if (type === PLACEMENT) {
            let newDOM = createDOM(newVChild); //根据新的虚拟DOM创建新的真实DOM
            let childNode = childNodes[mountIndex]; //获取原来老的DOM中的对应的索引出的真实DOM；可能有也可能没有
            if (childNode) {
                parentDOM.insertBefore(newDOM, childNode);
            } else {
                parentDOM.appendChild(newDOM);
            }
        } else if (type === MOVE) {
            let oldDOM = findDOM(oldVChild);
            let childNode = childNodes[mountIndex];
            if (childNode) {
                parentDOM.insertBefore(oldDOM, childNode);
            } else {
                parentDOM.appendChild(oldDOM);
            }
        }
    })
}
/**
 * 更新类组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateClassComponent(oldVdom, newVdom) {
    let classInstance = newVdom.classInstance = oldVdom.classInstance;

    if (classInstance.componentWillReceiveProps) {
        classInstance.componentWillReceiveProps(newVdom.props);
    }

    classInstance.updater.emitUpdate(newVdom.props);

    newVdom.oldRenderVdom = classInstance.oldRenderVdom; //不管更不更新，都需要将老的虚拟渲染DOM赋给新的虚拟DOM
}
/**
 * 更新函数组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateFunctionComponent(oldVdom, newVdom) {
    let parentDOM = findDOM(oldVdom).parentNode; //获取老的真实DOM的父节点
    let { type, props } = newVdom;
    //函数组件更新，每次都要重新执行函数
    let newRenderVdom = type(props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
    newVdom.oldRenderVdom = newRenderVdom;
}
/**
 * 挂载新节点
 * @param {*} vdom 新节点的虚拟DOM
 */
function mountVdom(parentDOM, vdom, nextDOM) {
    let newDOM = createDOM(vdom);
    if (nextDOM) {
        parentDOM.insertBefore(newDOM, nextDOM);
    } else {
        parentDOM.appendChild(newDOM);
    }

    if (newDOM.componentDidMount) {
        newDOM.componentDidMount();
    }
}
/**
 * 卸载老节点
 * @param {*} vdom 老节点的虚拟DOM
 */
function unMountVdom(vdom) {
    let { props, ref } = vdom;
    let currentDOM = findDOM(vdom); //获取老的真实DOM
    //如果这个子节点是一个类组件的话，我们还要执行它的卸载的生命周期函数
    if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
        vdom.classInstance.componentWillUnmount();
    }
    //如果节点有ref，需要清空其指向
    if (ref) {
        ref.current = null;
    }
    //如果有子节点，需要递归删除所有的子节点
    if (props.children) {
        let children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(unMountVdom);
    }
    //从父节点中把自己删除
    if (currentDOM) currentDOM.parentNode.removeChild(currentDOM);
}
/**
 * 从虚拟DOM返回真实DOM
 * @param {*} vdom 
 */
export function findDOM(vdom) {
    if (!vdom) return null;
    if (vdom.dom) { //如果它身上有dom属性，那说明这个vdom是一个原生组件的虚拟dom
        return vdom.dom;
    } else {
        return findDOM(vdom.oldRenderVdom);
    }
}
const ReactDOM = {
    render,
    createPortal: render
}
export default ReactDOM;