import pathToRegexp from 'path-to-regexp';

/**
 * 将路径转换成正则表达式
 * @param {*} path 路径
 * @param {*} options 选项
 */
function compilePath(path, options) {
    let keys = []; //用来存路径参数的参数名的数组
    let regexp = pathToRegexp(path, keys, options);
    return { keys, regexp };
}
/**
 * 计算路径是否匹配
 * @param {*} pathname 当前地址栏中的路径
 * @param {*} options {path, exact, strict, sensitive}
 * sensitive 是否大小写敏感（默认值：false 不敏感）
 * end 是否匹配整个字符串 (默认值: true) 也就是说后面是否还可以跟别的内容 end:true 不能跟  end:false 能跟
 * strict 是否允许结尾有一个可选的‘/’ (默认值: false)
 */
function matchPath(pathname, options = {}) {
    /**
     * path: 此Route对应的路径
     * exact: 是否精确匹配
     * strict: 是否严格匹配
     * sensitive: 是否大小写敏感
     */
    let { path = '/', exact = false, strict = false, sensitive = false } = options; //path=/profile
    //先将路径path编译成正则
    let { keys, regexp } = compilePath(path, { end: exact, strict, sensitive });
    //pathname=/profile/id
    const match = regexp.exec(pathname); //用路径path转成的正则和当前地址栏中的路径进行匹配
    if (!match) return null;
    const [url, ...values] = match; //url=/profile
    //是否精确匹配
    const isExact = pathname === url; //pathname=/profile/id !== url=/profile
    if (exact && !isExact) return null;
    return {
        path, //Route的路径
        url, //Route路径转成的正则表达式匹配的路径
        isExact, //是否精确匹配
        params: keys.reduce((memo, key, index) => {
            memo[key.name] = values[index];
            return memo;
        }, {})
    }
}
export default matchPath;