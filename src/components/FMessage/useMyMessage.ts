import { messageApiInjectionKey } from "./context";
import { IMessage } from "./type";
import { inject } from "vue";
export function useFMessage() {
  const api = inject(messageApiInjectionKey, null);
  if (api === null) {
    console.warn("useMessage must be used within a MessageProvider");
  }
  return api as IMessage;
}
