import type { VNode, VNodeChild, Ref } from "vue";
import "vue/jsx";
/**
 * 把指定的属性变为可选
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * 把一个interface 或者 type 变为用vue3 Ref<>内置类型包裹的属性
 */
export type IRefsProps<T, P> = {
    [K in keyof P]: K extends T ? P[K] : Ref<P[K]>;
};
/**
 * 先把所有属性变为可选，再指定某个属性为必选
 */
export type RequiredObj<T, V extends keyof T> = Required<Pick<Partial<T>, V>> & Omit<Partial<T>, V>;
type Render = number | string | JSX.Element | VNode;
export type ReturnTypeCallBack<T = unknown> = (e: MouseEvent) => T;
export type NonRefKeys = "removeModal" | "anotherNonRefField";
export interface IProps {
    content: Render;
    removeModal: () => void;
    loading: boolean;
    negativeText: string;
    positiveText: string;
    clickPositon: {
        x: number;
        y: number;
    };
    title: string;
    type: "info" | "success" | "warning" | "error";
    action: () => VNodeChild;
    maskClosable: boolean;
    transformOrigin: "mouse" | "center";
    closeOnEsc: boolean;
    onNegativeClick: ReturnTypeCallBack;
    onPositiveClick: ReturnTypeCallBack;
}
export type IIconMap = {
    [key in IProps["type"]]: {
        icon: string;
        size: number;
    };
};
type DeleteBuiltProp = Omit<IProps, "removeModal" | "clickPositon">;
export type ModalFuncReturn = DeleteBuiltProp & setData;
export type DialogInstance = (data: RequiredObj<IProps, "content">) => ModalFuncReturn;
export type IDialog = DialogInstance & {
    info: DialogInstance;
    success: DialogInstance;
    warning: DialogInstance;
    error: DialogInstance;
};
export type setData = {
    setLoading: (loading: boolean) => void;
    setPositiveText: (text: string) => void;
    setNegativeText: (text: string) => void;
};
export {};
