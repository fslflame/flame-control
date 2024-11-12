/**
 * 将树形结构数据平铺
 * @param folderList
 * @param collect
 */
import type { InjectionKey } from "vue";
export declare function recursionTile<T extends any[]>(folderList: T, collect: T): T;
/**
 * 设置默认值
 * @param key 需要检查的属性
 * @param value 默认值
 * @param options 原对象
 */
export declare function _defaultValue<V>(key: keyof V, value: unknown, options?: V): void;
/**
 * 设置注入唯一Symbol key值
 */
export declare function createInjectionKey<T>(key: string): InjectionKey<T>;
