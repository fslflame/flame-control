import Tootip from "./Tootip";
import {
  useElementBounding,
  useWindowSize,
  useWindowScroll,
  useMutationObserver,
} from "@vueuse/core";
import type {
  ITootipProps,
  UseElementBoundingReturn,
  IEllipsisProps,
} from "./types";
import { ellipsisApiInjectionKey } from "./context";
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  toValue,
  watch,
  provide,
  computed,
} from "vue";
export default defineComponent(
  (props: IEllipsisProps, { slots }) => {
    const triggerInnerRef = ref<HTMLElement | null>(null);
    const ellipsisClass = ref<"ellipsis" | "">("");
    const triggerRef = ref<HTMLElement | null>(null); // 触发组件的ref实例
    const triggerClientRef = useElementBounding(triggerRef); // 鼠标移入得到触发元素的位置信息
    const { width: windowWidth } = useWindowSize();
    const position = reactive({
      x: 0,
      y: 0,
    });
    const isShowTootip = ref(false);
    const state = reactive<ITootipProps>({
      showRef: false,
      setShowRef(s) {
        state.showRef = s;
      },
      transformPosition: "",
      setTransformPosition(t) {
        state.transformPosition = t;
      },
      position: "top",
      setPosition(p) {
        state.position = p;
      },
      tootipWidth: 0,
      setTootipWidth(width) {
        state.tootipWidth = width;
      },
      tootipHeight: 0,
      setTootipHeight(height) {
        state.tootipHeight = height;
      },
      isTransition: false,
      setTransition(s) {
        state.isTransition = s;
      },
      triangle: "center",
      setTriangle(t) {
        state.triangle = t;
      },
      originPosition: "bottom center",
      setOriginPosition(o) {
        state.originPosition = o;
      },
      isTootipInst: false,
      setTootipInst(t) {
        state.isTootipInst = t;
      },
      hoverActive: false,
      setHoverActive(h) {
        state.hoverActive = h;
      },
      resetReactive() {
        state.setShowRef(false);
        state.setTootipWidth(0);
        state.setTootipHeight(0);
        state.setTransformPosition("");
        state.setPosition("top");
        state.setTransition(false);
        state.setTriangle("center");
        state.setOriginPosition("bottom center");
        state.setTootipInst(false);
        state.setHoverActive(false);
        position.x = 0;
        position.y = 0;
        state.flag = true;
        if (timerId) {
          clearInterval(timerId as number);
          timerId = null;
        }
      },
      isTransitionRef: false,
      setTransitionRef(t) {
        state.isTransitionRef = t;
      },
      flag: true,
      setTransformPositionFn() {
        const transformPosition = getPosition(triggerClientRef, state);
        state.setTransformPosition(transformPosition);
      },
    });
    const { y: windowY } = useWindowScroll();

    function initEllipsis() {
      const innerWidth = triggerInnerRef.value?.offsetWidth;
      const width = triggerRef.value?.offsetWidth;
      if (!innerWidth) {
        ellipsisClass.value = "";
        isShowTootip.value = false;
        return;
      }
      if (!width) {
        console.warn("没有获取到触发元素的宽度");
        return;
      }
      ellipsisClass.value = innerWidth <= width ? "" : "ellipsis";
      isShowTootip.value = !(innerWidth <= width);
    }
    const { stop: stopMutation } = useMutationObserver(
      triggerInnerRef,
      initEllipsis,
      {
        attributes: true,
        characterData: true,
        subtree: true,
      }
    );
    function isResolveSlotText() {
      const s = props.defultValue ? props.defultValue : slots.default?.();
      if (props.defultValue) {
        // console.log("defultValue", s);
      }
      if (Array.isArray(s)) {
        if (s && typeof s.at(0)?.type !== "symbol") {
          stopMutation();
          return console.error(
            "Incoming slot contents cannot be wrapped by nodes"
          );
        }
        if (s && s.length > 1) {
          stopMutation();
          return console.error("Ellipsis component only support one slot");
        }
      }
    }
    onMounted(() => {
      isResolveSlotText();
      initEllipsis();
    });
    onUnmounted(stopMutation);
    function specialPosition(
      triggerClientRef: UseElementBoundingReturn,
      state: ITootipProps,
      pn: "top" | "bottom"
    ) {
      const ys =
        windowY.value > 0
          ? Math.round(triggerClientRef.y.value + windowY.value)
          : triggerClientRef.y.value;

      if (toValue(state.tootipWidth) > position.x + state.tootipWidth / 2) {
        state.setTriangle("left");
        state.setOriginPosition(`${pn === "bottom" ? "top" : "bottom"} left`);
        return `translate(${toValue(position.x)}px, ${toValue(
          ys + (pn === "bottom" ? toValue(triggerClientRef.height) : 0)
        )}px) ${pn === "bottom" ? "" : "translateY(-100%)"}`;
      }
      if (
        windowWidth.value - triggerClientRef.right.value <
        state.tootipWidth / 2
      ) {
        state.setTriangle("right");
        state.setOriginPosition(`${pn === "bottom" ? "top" : "bottom"} right`);
        return `translate(${
          toValue(position.x) -
          toValue(state.tootipWidth - triggerClientRef.width.value)
        }px, ${
          ys + (pn === "bottom" ? toValue(triggerClientRef.height) : 0)
        }px) ${pn === "bottom" ? "" : "translateY(-100%)"}`;
      }
      if (pn === "top") {
        return `translate(${
          toValue(position.x) + toValue(triggerClientRef.width) / 2
        }px, ${ys}px) translateY(-100%) translateX(-50%)`;
      } else {
        return `translate(${
          toValue(position.x) + toValue(triggerClientRef.width) / 2
        }px, ${ys + toValue(triggerClientRef.height)}px) translateX(-50%)`;
      }
    }
    function getPosition(
      triggerClientRef: UseElementBoundingReturn,
      state: ITootipProps
    ) {
      if (toValue(state.tootipHeight) < toValue(triggerClientRef.y)) {
        state.setPosition("top");
        state.setTriangle("center");
        state.setOriginPosition("bottom center");
        return specialPosition(triggerClientRef, state, "top");
      } else {
        state.setPosition("bottom");
        state.setTriangle("center");
        state.setOriginPosition("top center");
        return specialPosition(triggerClientRef, state, "bottom");
      }
    }
    function getTotalOffset(element: HTMLElement | null) {
      position.y = 0;
      position.x = 0;
      if (!element) {
        return;
      }
      while (element) {
        position.y += element.offsetTop;
        position.x += element.offsetLeft;
        element = element.offsetParent as HTMLElement;
      }
    }
    watch(
      [
        () => state.tootipHeight,
        triggerClientRef.x,
        triggerClientRef.y,
        windowWidth,
      ],
      () => {
        if (!state.tootipHeight) {
          return;
        }
        triggerClientRef.update(); //　为什么要重新更新一下 ？ 因为 父元素使用transition元素包括，有缩放动画，然后useElementBounding获取的是首次渲染后的值和改变位置之后的值 因为transition是改变了父组件的css样式，没有触发tootip的位置更新，所以动画执行完后，tootip的位置还是动画开始执行的位置, 需要手动获取一下最新的值
        getTotalOffset(triggerRef.value);
        state.setTransformPositionFn();
      }
    );
    provide(ellipsisApiInjectionKey, state);
    let timerId: number | null;
    function mouseEnter() {
      state.setHoverActive(true);
      if (state.flag) {
        state.flag = false;
        state.setTransition(true);
        state.setShowRef(true);
        timerId = window.setInterval(() => {
          if (state.hoverActive) {
            return;
          }
          state.setTransitionRef(false);
        });
      }
    }
    function mouseLeave() {
      state.setHoverActive(false);
    }
    const ellipsis = {
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
    const omit = computed(() =>
      ellipsisClass.value === "ellipsis" ? ellipsis : ""
    );
    return () => (
      <div
        ref={triggerRef}
        onMouseenter={mouseEnter}
        onMouseleave={mouseLeave}
        style={{
          whiteSpace: "nowrap",
          ...omit.value,
        }}
      >
        <span ref={triggerInnerRef}>{slots.default?.()}</span>
        {isShowTootip.value ? <Tootip>{slots.default?.()}</Tootip> : null}
      </div>
    );
  },
  {
    props: ["defultValue"],
  }
);
