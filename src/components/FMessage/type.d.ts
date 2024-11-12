import type { VNodeChild } from "vue";
export type MessageProviderProps = {
    max?: number;
    placement?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";
};
type ContentType = JSX.Element | string | (() => VNodeChild);
export type MessageOptions = {
    duration?: number;
    type?: MessageType;
    closable?: boolean;
};
export type PrivateMessageReactive = MessageOptions & {
    key: string;
    content: ContentType;
    destroy: () => void;
};
export type PrivateRef = {
    hide: () => void;
};
export type PrivateMessageRef = Record<string, PrivateRef> & MessageOptions;
export type MessageType = "info" | "success" | "warning" | "error";
export type IIconMap = {
    [key in MessageType]: {
        icon: string;
        size: number;
    };
};
export type ReturnReactive = Omit<PrivateMessageReactive, "key">;
export type Context = (content: ContentType, options?: MessageOptions) => ReturnReactive;
export interface IMessage extends Context {
    info: Context;
    success: Context;
    warning: Context;
    error: Context;
}
export interface ITimerIds {
    key: string;
    timerId: number;
}
export interface IMessageProps {
    messageInfo: PrivateMessageReactive;
    onInternalAfterLeave: (key: string) => void;
}
export {};
