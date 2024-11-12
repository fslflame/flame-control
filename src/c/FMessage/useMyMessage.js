import { messageApiInjectionKey } from "./context";
import { inject } from "vue";
export function useFMessage() {
    const api = inject(messageApiInjectionKey, null);
    if (api === null) {
        console.warn("useMessage must be used within a MessageProvider");
    }
    return api;
}
//# sourceMappingURL=useMyMessage.js.map