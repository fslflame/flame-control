import { Teleport, defineComponent, provide, reactive, ref } from "vue";
import type {
  IMessage,
  Context,
  PrivateMessageReactive,
  PrivateMessageRef,
  PrivateRef,
  MessageProviderProps,
} from "./type";
import { messageApiInjectionKey } from "./context";
import Message from "./Message";
import { uniqueId } from "xe-utils";
import { _defaultValue } from "@/utils";
import * as C from "./style.cssr";
/**
 * 消息组件
 */
export default defineComponent(
  (props: MessageProviderProps, { slots }) => {
    const { max = 10, placement = "top" } = props;
    const messageLists = ref<PrivateMessageReactive[]>([]);
    const api: IMessage = (content, options) => createMessage(content, options);
    api.info = (content, options) => {
      return createMessage(content, { ...options, type: "info" });
    };
    api.success = (content, options) => {
      return createMessage(content, { ...options, type: "success" });
    };
    api.error = (content, options) => {
      return createMessage(content, { ...options, type: "error" });
    };
    api.warning = (content, options) => {
      return createMessage(content, { ...options, type: "warning" });
    };
    const messageRef = ref<PrivateMessageRef>({});
    const createMessage: Context = (content, options) => {
      _defaultValue("duration", 3000, options);
      _defaultValue("type", null, options);
      _defaultValue("closable", false, options);
      const key = uniqueId("message-");
      const messageReactive = reactive({
        key,
        content,
        ...options,
        destroy() {
          messageRef.value[key].hide();
        },
      }) as PrivateMessageReactive;
      if (messageLists.value.length >= max) {
        messageLists.value.shift();
      }
      messageLists.value.push(messageReactive);
      return messageReactive;
    };
    function handleAfterLeave(key: string) {
      messageLists.value.splice(
        messageLists.value.findIndex((message) => message.key === key),
        1
      );
      delete messageRef.value[key];
    }
    // 依赖注入
    provide(messageApiInjectionKey, api);
    return () => (
      <>
        {slots.default?.()}
        {messageLists.value.length ? (
          <Teleport to="body">
            <C.MessageContainer
              variants={{
                placement,
              }}
            >
              {messageLists.value.map((message) => (
                <Message
                  ref={
                    ((inst: PrivateRef) => {
                      if (inst) {
                        messageRef.value[message.key] = inst;
                      }
                    }) as () => void
                  }
                  key={message.key}
                  messageInfo={message}
                  onInternalAfterLeave={handleAfterLeave}
                />
              ))}
            </C.MessageContainer>
          </Teleport>
        ) : null}
      </>
    );
  },
  {
    props: ["max", "placement"],
  }
);
