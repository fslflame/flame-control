const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
defineOptions({ name: "GiSvgIcon" });
import { computed } from "vue";
const props = withDefaults(defineProps(), {
    name: "",
    color: "",
    size: 20,
});
// 判断传入的值，是否带有单位，如果没有，就默认用px单位
const getUnitValue = (value) => {
    return /(px|em|rem|%)$/.test(value.toString()) ? value : value + "px";
};
const iconSize = computed(() => {
    return getUnitValue(props.size);
});
const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
    if (props.name)
        return `svg-icon icon-${props.name}`;
    return "svg-icon";
});
const __VLS_withDefaultsArg = (function (t) { return t; })({
    name: "",
    color: "",
    size: 20,
});
let __VLS_modelEmitsType;
const __VLS_componentsOption = {};
let __VLS_name;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    /* CSS variable injection */
    /* CSS variable injection end */
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_intrinsicElements.svg;
    __VLS_intrinsicElements.svg;
    __VLS_intrinsicElements.use;
    __VLS_intrinsicElements.use;
    {
        const __VLS_0 = __VLS_intrinsicElements["svg"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{}, "aria-hidden": ("true"), ...(__VLS_ctx.$attrs), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, "aria-hidden": ("true"), ...(__VLS_ctx.$attrs), }));
        (__VLS_ctx.svgClass);
        ({ color: __VLS_ctx.color, fill: __VLS_ctx.color, width: __VLS_ctx.iconSize, height: __VLS_ctx.iconSize });
        __VLS_styleScopedClasses = (svgClass);
        {
            const __VLS_5 = __VLS_intrinsicElements["use"];
            const __VLS_6 = __VLS_elementAsFunctionalComponent(__VLS_5);
            const __VLS_7 = __VLS_6({ ...{}, "xlink:href": ((__VLS_ctx.iconName)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, "xlink:href": ((__VLS_ctx.iconName)), }));
            const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
    }
    var __VLS_slots;
    // @ts-ignore
    [$attrs, svgClass, color, color, iconSize, iconSize, iconName,];
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            iconSize: iconSize,
            iconName: iconName,
            svgClass: svgClass,
        };
    },
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {},
});
//# sourceMappingURL=index.vue.js.map