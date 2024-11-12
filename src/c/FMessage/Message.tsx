import SvgIcon from "@/components/SvgIcon/index.vue";
import type { IIconMap, IMessageProps } from "./type";
import * as C from "./style.cssr";
import { Transition, ref, defineComponent, onMounted } from "vue";
import { MRSIZE } from "../FDialog";
export default defineComponent(
  (props: IMessageProps, { expose }) => {
    const { messageInfo } = props;
    let timerId: number | null;
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
    function handlerBeforeEnter(e: Element) {
      const el = e as HTMLElement;
      el.style.marginBottom = "0";
    }
    function handlerEnter(e: Element) {
      const el = e as HTMLElement;
      const memorizedHeight = el.offsetHeight;
      el.style.maxHeight = "0";
      el.style.marginBottom = `${MRSIZE}px`;
      void el.offsetWidth;
      el.style.maxHeight = `${memorizedHeight}px`;
    }
    function handlerAfterEnter(e: Element) {
      const el = e as HTMLElement;
      el.style.maxHeight = "";
      el.style.marginBottom = "";
    }
    function handlerLeave(e: Element) {
      const el = e as HTMLElement;
      el.style.maxHeight = "0";
      el.style.marginBottom = "0";
    }
    function handlerBeforeleave(e: Element) {
      const el = e as HTMLElement;
      el.style.maxHeight = `${el.offsetHeight}px`;
      el.style.marginBottom = `${MRSIZE}px`;
    }
    function handlerAfterLeave(e: Element) {
      const { onInternalAfterLeave } = props;
      if (onInternalAfterLeave) {
        onInternalAfterLeave(messageInfo.key);
      }
      const el = e as HTMLElement;
      el.style.maxHeight = "";
      el.style.marginBottom = "";
    }
    const iconMap: IIconMap = {
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
    return () => (
      <Transition
        name="list"
        onBeforeEnter={handlerBeforeEnter}
        onEnter={handlerEnter}
        onLeave={handlerLeave}
        onAfterEnter={handlerAfterEnter}
        onBeforeLeave={handlerBeforeleave}
        onAfterLeave={handlerAfterLeave}
        appear
      >
        {showRef.value ? (
          <C.MessageWrapper>
            <C.MessageComp
              vars={{
                "grid-cols": `${messageInfo.type ? "auto" : ""} 1fr ${
                  messageInfo.closable ? "auto" : ""
                }`,
              }}
            >
              {messageInfo.type ? (
                <SvgIcon
                  name={iconMap[messageInfo.type].icon}
                  size={iconMap[messageInfo.type].size}
                ></SvgIcon>
              ) : null}
              <div>{messageInfo.content}</div>
              {messageInfo.closable ? (
                <div class="closable" onClick={() => hide()}>
                  <SvgIcon name="close" size="17"></SvgIcon>
                </div>
              ) : null}
            </C.MessageComp>
          </C.MessageWrapper>
        ) : null}
      </Transition>
    );
  },
  {
    props: ["messageInfo", "onInternalAfterLeave"],
  }
);
