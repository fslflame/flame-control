import type { DialogProps, PaginationProps } from "naive-ui";
h;
declare global {
  type IModelProps<T = any> = {
    showModel: boolean;
    objInfo?: T | null;
  } & DialogProps;
  interface IPropsName {
    [propsName: string | number]: any;
  }
  interface IEventClient {
    clientX: number | string;
    clientY: number | string;
  }
  /**
   * 把指定的属性变为可选
   */
  type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  /**
   * 把一个interface 或者 type 变为用vue3 Ref<>内置类型包裹的属性
   */
  type IRefsProps<T, P> = {
    [K in keyof P]: K extends T ? P[K] : Ref<P[K]>;
  };
  /**
   * 先把所有属性变为可选，再指定某个属性为必选
   */
  type RequiredObj<T, V extends keyof T> = Required<Pick<Partial<T>, V>> &
    Omit<Partial<T>, V>;
}
