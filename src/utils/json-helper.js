/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @LastEditors: Leo
 * @version: 0.0.0
 * @Description: JSON 操作
 * @Date: 2019-04-04 23:00:14
 * @LastEditTime: 2019-04-08 16:47:09
 */

// #region mergeJSON - 合并JSON
/**
 * 直接修改 main 将 minor 合并到 main
 * @export
 * @param {*} main
 * @param {*} minor
 */
export function mergeJSON(main = {}, minor = {}) {
  Object.keys(minor).forEach(key => {
    const type = Object.prototype.toString.call(minor[key]);
    if (type === "[object Object]") {
      mergeJSON(main[key] || {}, minor[key] || {});
    } else {
      main[key] =
        type === "[object Null]" || type === "[object Undefined]"
          ? main[key]
          : minor[key];
    }
  });
}
// #endregion

export default {
  // [mergeJSON 性能对比](https://jsperf.com/deepmerge)
  mergeJSON
};
