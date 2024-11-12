import { Transition, Teleport } from "vue";
import { ellipsisApiInjectionKey } from "./context";
import { default as Fil } from "./t";
import { CSSProperties, defineComponent, inject } from "vue";
export default defineComponent((_, { slots }) => {
  const data = inject(ellipsisApiInjectionKey);
  function handleBeforeEnter(e: Element) {
    const el = e as HTMLElement;
    el.style.transform = `${data?.transformPosition} scale(0.85)`;
    el.style.opacity = "0";
  }
  function handleEnter(e: Element) {
    const el = e as HTMLElement;
    el.offsetWidth;
    el.style.opacity = "1";
    el.style.transformOrigin = data?.originPosition as string;
    el.style.transform = `${data?.transformPosition} scale(1)`;
  }
  function handleBeforeLeave(e: Element) {
    const el = e as HTMLElement;
    el.style.opacity = "1";
    el.style.transform = `${data?.transformPosition} scale(1)`;
  }
  function handleLeave(e: Element) {
    const el = e as HTMLElement;
    el.style.opacity = "0";
    el.style.transform = `${data?.transformPosition} scale(0.85)`;
  }
  function handleAfterLeave(e: Element) {
    const el = e as HTMLElement;
    el.style.opacity = "";
    el.style.transformOrigin = "";
    el.style.transform = ``;
    data?.resetReactive();
  }
  const transitionStyle: CSSProperties = {
    position: "absolute",
    inset: "0",
    zIndex: "2007",
    height: "0",
  };
  return () => (
    <Teleport to="body">
      {data?.showRef ? (
        <div style={transitionStyle}>
          {data?.isTransition ? <Fil>{slots.default?.()}</Fil> : null}
          {data?.isTootipInst ? (
            <Transition
              onBeforeEnter={handleBeforeEnter}
              onEnter={handleEnter}
              onBeforeLeave={handleBeforeLeave}
              onLeave={handleLeave}
              onAfterLeave={handleAfterLeave}
              name="eilipsis"
              appear
            >
              {data.isTransitionRef ? <Fil>{slots.default?.()}</Fil> : null}
            </Transition>
          ) : null}
        </div>
      ) : null}
    </Teleport>
  );
});
