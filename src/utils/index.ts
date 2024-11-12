/**
 * 将树形结构数据平铺
 * @param folderList
 * @param collect
 */
import type { InjectionKey } from "vue";
export function recursionTile<T extends any[]>(folderList: T, collect: T) {
  if (Array.isArray(folderList)) {
    folderList.forEach((folder) => {
      if (Array.isArray(folder.children) && folder.children.length) {
        recursionTile(folder.children, collect);
        collect.push(folder);
      } else {
        collect.push(folder);
      }
    });
  }
  return collect;
}
/**
 * 设置默认值
 * @param key 需要检查的属性
 * @param value 默认值
 * @param options 原对象
 */
export function _defaultValue<V>(key: keyof V, value: unknown, options?: V) {
  if (!options) {
    return;
  }
  options[key] ?? ((options[key] as unknown) = value);
}
/**
 * 设置注入唯一Symbol key值
 */
export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return Symbol(key);
}
