const getSeq = (arr) => {
    let len = arr.length;
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
    len = result.length;
    let last = result[len - 1];
    while (len-- > 0) {
        result[len] = last;
        last = p[last]; // 通过最后一项倒序查找
    }
    return result;
};
console.log(getSeq([2, 3, 1, 5, 6, 8, 7, 9, 4]));