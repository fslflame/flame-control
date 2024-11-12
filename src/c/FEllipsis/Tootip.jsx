import { Transition, Teleport } from "vue";
import { ellipsisApiInjectionKey } from "./context";
import { default as Fil } from "./t";
import { defineComponent, inject } from "vue";
export default defineComponent((_, { slots }) => {
    const data = inject(ellipsisApiInjectionKey);
    function handleBeforeEnter(e) {
        const el = e;
        el.style.transform = `${data?.transformPosition} scale(0.85)`;
        el.style.opacity = "0";
    }
    function handleEnter(e) {
        const el = e;
        el.offsetWidth;
        el.style.opacity = "1";
        el.style.transformOrigin = data?.originPosition;
        el.style.transform = `${data?.transformPosition} scale(1)`;
    }
    function handleBeforeLeave(e) {
        const el = e;
        el.style.opacity = "1";
        el.style.transform = `${data?.transformPosition} scale(1)`;
    }
    function handleLeave(e) {
        const el = e;
        el.style.opacity = "0";
        el.style.transform = `${data?.transformPosition} scale(0.85)`;
    }
    function handleAfterLeave(e) {
        const el = e;
        el.style.opacity = "";
        el.style.transformOrigin = "";
        el.style.transform = ``;
        data?.resetReactive();
    }
    const transitionStyle = {
        position: "absolute",
        inset: "0",
        zIndex: "2007",
        height: "0",
    };
    return () => (<Teleport to="body">
      {data?.showRef ? (<div style={transitionStyle}>
          {data?.isTransition ? <Fil>{slots.default?.()}</Fil> : null}
          {data?.isTootipInst ? (<Transition onBeforeEnter={handleBeforeEnter} onEnter={handleEnter} onBeforeLeave={handleBeforeLeave} onLeave={handleLeave} onAfterLeave={handleAfterLeave} name="eilipsis" appear>
              {data.isTransitionRef ? <Fil>{slots.default?.()}</Fil> : null}
            </Transition>) : null}
        </div>) : null}
    </Teleport>);
});
//# sourceMappingURL=Tootip.jsx.map