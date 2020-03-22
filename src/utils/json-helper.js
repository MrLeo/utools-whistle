// #region mergeJSON - 合并JSON
/**
 * 直接修改 main 将 minor 合并到 main
 * @export
 * @param {*} main
 * @param {*} minor
 */
export function mergeJSON(main = {}, minor = {}) {
  Object.keys(minor).forEach(key => {
    const type = Object.prototype.toString.call(minor[key])
    if (type === '[object Object]') {
      mergeJSON(main[key] || {}, minor[key] || {})
    } else {
      main[key] = type === '[object Null]' || type === '[object Undefined]' ? main[key] : minor[key]
    }
  })
}
// #endregion

export default {
  // [mergeJSON 性能对比](https://jsperf.com/deepmerge)
  mergeJSON
}
