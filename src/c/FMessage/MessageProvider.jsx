import { Teleport, defineComponent, provide, reactive, ref } from "vue";
import { messageApiInjectionKey } from "./context";
import Message from "./Message";
import { uniqueId } from "xe-utils";
import { _defaultValue } from "@/utils";
import * as C from "./style.cssr";
/**
 * 消息组件
 */
export default defineComponent((props, { slots }) => {
    const { max = 10, placement = "top" } = props;
    const messageLists = ref([]);
    const api = (content, options) => createMessage(content, options);
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
    const messageRef = ref({});
    const createMessage = (content, options) => {
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
        });
        if (messageLists.value.length >= max) {
            messageLists.value.shift();
        }
        messageLists.value.push(messageReactive);
        return messageReactive;
    };
    function handleAfterLeave(key) {
        messageLists.value.splice(messageLists.value.findIndex((message) => message.key === key), 1);
        delete messageRef.value[key];
    }
    // 依赖注入
    provide(messageApiInjectionKey, api);
    return () => (<>
        {slots.default?.()}
        {messageLists.value.length ? (<Teleport to="body">
            <C.MessageContainer variants={{
                placement,
            }}>
              {messageLists.value.map((message) => (<Message ref={((inst) => {
                    if (inst) {
                        messageRef.value[message.key] = inst;
                    }
                })} key={message.key} messageInfo={message} onInternalAfterLeave={handleAfterLeave}/>))}
            </C.MessageContainer>
          </Teleport>) : null}
      </>);
}, {
    props: ["max", "placement"],
});
//# sourceMappingURL=MessageProvider.jsx.map