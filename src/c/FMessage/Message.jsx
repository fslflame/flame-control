import SvgIcon from "@/components/SvgIcon/index.vue";
import * as C from "./style.cssr";
import { Transition, ref, defineComponent, onMounted } from "vue";
import { MRSIZE } from "../FDialog";
export default defineComponent((props, { expose }) => {
    const { messageInfo } = props;
    let timerId;
    onMounted(setHideTimeout);
    const showRef = ref(true);
    function setHideTimeout() {
        const { duration } = messageInfo;
        if (duration === 0) {
            return;
        }
        timerId = window.setTimeout(hide, duration);
    }
    function hide() {
        showRef.value = false;
        if (timerId) {
            window.clearTimeout(timerId);
            timerId = null;
        }
    }
    function handlerBeforeEnter(e) {
        const el = e;
        el.style.marginBottom = "0";
    }
    function handlerEnter(e) {
        const el = e;
        const memorizedHeight = el.offsetHeight;
        el.style.maxHeight = "0";
        el.style.marginBottom = `${MRSIZE}px`;
        void el.offsetWidth;
        el.style.maxHeight = `${memorizedHeight}px`;
    }
    function handlerAfterEnter(e) {
        const el = e;
        el.style.maxHeight = "";
        el.style.marginBottom = "";
    }
    function handlerLeave(e) {
        const el = e;
        el.style.maxHeight = "0";
        el.style.marginBottom = "0";
    }
    function handlerBeforeleave(e) {
        const el = e;
        el.style.maxHeight = `${el.offsetHeight}px`;
        el.style.marginBottom = `${MRSIZE}px`;
    }
    function handlerAfterLeave(e) {
        const { onInternalAfterLeave } = props;
        if (onInternalAfterLeave) {
            onInternalAfterLeave(messageInfo.key);
        }
        const el = e;
        el.style.maxHeight = "";
        el.style.marginBottom = "";
    }
    const iconMap = {
        error: {
            icon: "error",
            size: 20,
        },
        success: {
            icon: "success",
            size: 20,
        },
        warning: {
            icon: "warning",
            size: 20,
        },
        info: {
            icon: "info",
            size: 20,
        },
    };
    expose({
        hide,
    });
    return () => (<Transition name="list" onBeforeEnter={handlerBeforeEnter} onEnter={handlerEnter} onLeave={handlerLeave} onAfterEnter={handlerAfterEnter} onBeforeLeave={handlerBeforeleave} onAfterLeave={handlerAfterLeave} appear>
        {showRef.value ? (<C.MessageWrapper>
            <C.MessageComp vars={{
                "grid-cols": `${messageInfo.type ? "auto" : ""} 1fr ${messageInfo.closable ? "auto" : ""}`,
            }}>
              {messageInfo.type ? (<SvgIcon name={iconMap[messageInfo.type].icon} size={iconMap[messageInfo.type].size}></SvgIcon>) : null}
              <div>{messageInfo.content}</div>
              {messageInfo.closable ? (<div class="closable" onClick={() => hide()}>
                  <SvgIcon name="close" size="17"></SvgIcon>
                </div>) : null}
            </C.MessageComp>
          </C.MessageWrapper>) : null}
      </Transition>);
}, {
    props: ["messageInfo", "onInternalAfterLeave"],
});
//# sourceMappingURL=Message.jsx.map