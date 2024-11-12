export function recursionTile(folderList, collect) {
    if (Array.isArray(folderList)) {
        folderList.forEach((folder) => {
            if (Array.isArray(folder.children) && folder.children.length) {
                recursionTile(folder.children, collect);
                collect.push(folder);
            }
            else {
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
export function _defaultValue(key, value, options) {
    if (!options) {
        return;
    }
    options[key] ?? (options[key] = value);
}
/**
 * 设置注入唯一Symbol key值
 */
export function createInjectionKey(key) {
    return Symbol(key);
}
//# sourceMappingURL=index.js.map