import { compareTwoVdom, findDOM } from "./react-dom";

export const updateQueue = {
    isBatchingUpdate: false, //用来控制更新是同步还是异步
    updaters: [], //更新的数组
    batchUpdate() { //批量更新
        updateQueue.updaters.forEach(updater => updater.updateComponent());
        updateQueue.isBatchingUpdate = false;
        updateQueue.updaters.length = 0; //批量更新完，清空队列
    }
}
class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance;
        this.pendingStates = [];
    }
    addState(partialState) {
        this.pendingStates.push(partialState); //每次更新并非直接，而是加入到等待更新队列中
        this.emitUpdate(); //触发更新函数
    }
    emitUpdate(nextProps) {
        this.nextProps = nextProps;

        if (updateQueue.isBatchingUpdate) { //当前处于批量更新模式
            updateQueue.updaters.push(this);
        } else {
            this.updateComponent();
        }
    }
    updateComponent() {
        let { classInstance, pendingStates, nextProps } = this;
        //如果属性更新、或者说状态更新了都会进行更新
        if (nextProps || pendingStates.length > 0) {
            shouldUpdate(classInstance, nextProps, this.getState());
        }
    }
    getState() { //基于老的状态和pendingStates获取新状态
        let { classInstance, pendingStates } = this;
        let { state } = classInstance; //老的状态
        pendingStates.forEach(nextState => { //setState可以传递函数，传递函数就等待函数执行完
            if (typeof nextState === 'function') {
                nextState = nextState(state);
            }
            state = { ...state, ...nextState };
        });
        pendingStates.length = 0; //情况等待更新的队列
        return state;
    }
}
function shouldUpdate(classInstance, nextProps, nextState) {
    // classInstance.state = nextState; //将新的状态赋给类的实例上的state属性
    // classInstance.forceUpdate(); //让类组件的实例强行更新
    let willUpdate = true;
    //如果有shouldComponentUpdate方法，并且shouldComponentUpdate执行结果是false的话，
    //才会将willUpdate设置false
    if (
        classInstance.shouldComponentUpdate &&
        !classInstance.shouldComponentUpdate(nextProps, nextState)
    ) {
        willUpdate = false;
    }
    if (willUpdate && classInstance.componentWillUpdate) {
        classInstance.componentWillUpdate();
    }
    if (nextProps) {
        classInstance.props = nextProps;
    }
    classInstance.state = nextState; //不管要不要更新，赋值都会执行
    if (willUpdate) {
        classInstance.forceUpdate();
    }
}
export class Component {
    /* 因为函数组件和类组件都会在编译后成为函数，
       为了区分类组件和函数组件，给类组件的类型加一个静态属性isReactComponent
     */
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.updater = new Updater(this);
    }
    setState(partialState) {
        this.updater.addState(partialState);
    }
    forceUpdate() {
        let oldRenderVdom = this.oldRenderVdom; //获取老的虚拟渲染DOM
        // let oldDOM = oldRenderVdom.dom; //获取老的真实DOM
        let oldDOM = findDOM(oldRenderVdom);
        let newRenderVdom = this.render(); //再次调用render，返回新的虚拟dom
        //oldDOM真实DOM元素，.parentNode属于原生dom-api
        compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
        this.oldRenderVdom = newRenderVdom;

        if (this.componentDidUpdate) {
            this.componentDidUpdate(this.props, this.state);
        }
    }
}
/**
 * 组件的更新原理
 * 1.初次挂载的时候，已经在页面上防止了一个原生组件(div、p、span等)
 * 2.更新的时候，使用新的状态，重新render返回新的虚拟DOM，再使用新的虚拟DOM生成新的真实DOM
 * 3.用新的真实DOM替换老的真实DOM就实现更新逻辑
 */