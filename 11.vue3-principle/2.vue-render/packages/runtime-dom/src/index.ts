import { extend } from "@vue/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

// runtime-dom 主要的作用就是为了抹平平台的差异，不同平台对dom操作方式是不同的，
// 将api传入runtime-core，core中可以调用这些方法
const renderOptions = extend(nodeOps, { patchProp });
console.log(renderOptions);