import { hasOwnProp } from "@vue/shared";

export const componentPublicInstance = {
    get({ _: instance }, key) {
        const { setupState, props, ctx } = instance;
        if (hasOwnProp(setupState, key)) {
            return setupState[key];
        } else if (hasOwnProp(ctx, key)) {
            return ctx[key];
        } else if (hasOwnProp(props, key)) {
            return props[key];
        }
    },
    set({ _: instance }, key, value) {
        const { setupState, props } = instance;
        if (hasOwnProp(setupState, key)) {
            setupState[key] = value;
        } else if (hasOwnProp(props, key)) {
            props[key] = value;
        }
        return true;
    }
}