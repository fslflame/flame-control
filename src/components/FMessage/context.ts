import { createInjectionKey } from "./utils";
import type { IMessage } from "./type";
export const messageApiInjectionKey =
  createInjectionKey<IMessage>("message-api");
