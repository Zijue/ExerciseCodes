const strategy = {};
['beforeCreate', 'created', 'beforeMount', 'mounted'].forEach(method => {
    strategy[method] = function (parentVal, childVal) {
        if (childVal) {
            if (parentVal) {
                return parentVal.concat(childVal); // 父亲和儿子进行合并
            } else {
                return [childVal]; // 如果儿子有声明周期而父亲没有，就将儿子的变成数组
            }
        } else {
            return parentVal; // 如果儿子没有就直接使用父亲的
        }
    }
})
export function mergeOptions(parentVal, childVal) { // 合并新老options
    /* parent a     child b
        1.如果a的有b的没有，那么采用a的
        2.如果a的有b的也有，那么采用b的
        3.特殊情况：如果是声明周期，那么就需要将多个声明周期合并成数组
     */
    const options = {};
    for (let p in parentVal) {
        mergeField(p);
    }
    for (let c in childVal) {
        if (!parentVal.hasOwnProperty(c)) {
            mergeField(c);
        }
    }
    function mergeField(key) {
        if (strategy[key]) { // 策略模式
            options[key] = strategy[key](parentVal[key], childVal[key]);
        } else {
            options[key] = childVal[key] || parentVal[key];
        }
    }
    return options;
}