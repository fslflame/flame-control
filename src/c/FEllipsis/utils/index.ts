export const DELAY = 300;
export const SIZE = 10;
import type { InjectionKey } from "vue";
export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return Symbol(key);
}
