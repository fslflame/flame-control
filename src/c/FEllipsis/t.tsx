import { ellipsisApiInjectionKey } from "./context";
import { useElementBounding, useWindowScroll } from "@vueuse/core";
import { SIZE } from "./utils";
import * as C from "./style.cssr";
import {
  CSSProperties,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
export default defineComponent((_, { slots }) => {
  const { y: windowY } = useWindowScroll();
  const data = inject(ellipsisApiInjectionKey);
  const el = ref<HTMLElement | null>(null);
  const { height: tootipHeight, width: tootipWidth } = useElementBounding(el);

  const stopWatchWindowY = watch(windowY, () => {
    data?.setTransformPositionFn();
  });
  onMounted(() => {
    if (!data?.isTootipInst) {
      data?.setTootipHeight(tootipHeight.value);
      data?.setTootipWidth(tootipWidth.value);
      data?.setTransition(false);
      data?.setTootipInst(true);
      data?.setTransitionRef(true);
    }
  });
  onUnmounted(stopWatchWindowY);
  function mouseEnter() {
    data?.setHoverActive(true);
  }
  function mouseLeave() {
    data?.setHoverActive(false);
  }
  const tootipStyle: CSSProperties = {
    position: "relative",
    backgroundColor: "var(--eilipsis-color)",
    padding: "var(--pd)",
    borderRadius: "var(--radius)",
    color: "var(--color)",
    boxShadow: "var(--box-shadow)",
    margin: data?.position === "top" ? `0 0 ${SIZE}px 0` : `${SIZE}px 0 0 0`,
    maxWidth: "300px",
    width: "max-content",
    wordBreak: "break-word",
  };
  const tootipRef: CSSProperties = {
    position: "absolute",
    zIndex: "auto",
    transformOrigin: data?.originPosition,
    transform: data?.transformPosition,
  };
  return () => (
    <div
      onMouseenter={mouseEnter}
      onMouseleave={mouseLeave}
      ref={el}
      style={tootipRef}
    >
      <div style={tootipStyle}>
        <div>{slots.default?.()}</div>
        <C.TriangleBox
          variants={{
            position: data?.position,
          }}
        >
          <C.TriangleChild
            variants={{
              position: data?.position,
              triangle: data?.triangle,
            }}
          ></C.TriangleChild>
        </C.TriangleBox>
      </div>
    </div>
  );
});
