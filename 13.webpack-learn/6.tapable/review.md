### tapable的核心原理
> 都是在Hook实例调用call、callAsync、promise方法时，动态编译字符串函数，然后去执行。核心方法`compile`