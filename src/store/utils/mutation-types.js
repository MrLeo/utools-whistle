/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @LastEditors: Leo
 * @version: 0.0.0
 * @Description: mutations 公共操作
 * @Date: 2019-03-20 11:22:27
 * @LastEditTime: 2019-06-27 14:59:44
 */

import { addFirstUpperCaseToPrototype, addFlatToPrototype } from '../../utils/index'

export function mutations(states) {
  addFirstUpperCaseToPrototype()
  addFlatToPrototype()

  return {
    // 单个state赋值
    ...Object.keys(states).reduce(
      (obj, key) => ({
        ...obj,
        [`set${key.firstUpperCase()}`]: (state, payload) => (state[key] = payload)
      }),
      {}
    ),
    // 多个state批量赋值
    setData(state, payload) {
      // state = { ...state, ...payload } // eslint-disable-line
      Object.assign(state, payload)
    },
    // 深度合并赋值
    setDataDeep: require('../../utils/json-helper').mergeJSON,
    // 表格页码改变
    pageChange(state, payload) {
      const { list, total } = payload
      state.total = total
      list.forEach((el, index) => {
        el.key = index
      })
      state.list.splice(0, state.list.length, ...list)
    }
  }
}

export default mutations

// let types = {
//   ...(r => {
//     // 去中心化
//     let sourceMap = {
//       mutations: {},
//       actions: {}
//     }
//     // eslint-disable-next-line
//     let res = r.keys().map(key => {
//       let rKey = r(key)
//       let newKey = key.replace(/^\.\/modules\/(.*)\.js$/g, '$1')
//       let namespaced = rKey.default.namespaced ? `${newKey}/` : ''
//       sourceMap.mutations[newKey] = {}
//       sourceMap.actions[newKey] = {}
//       for (let key in rKey.default.mutations) {
//         sourceMap.mutations[newKey][key] = `${namespaced}${key}`
//       }
//       for (let key in rKey.default.actions) {
//         sourceMap.actions[newKey][key] = `${namespaced}${key}`
//       }
//       return rKey.default
//     })
//     return sourceMap
//   })(require.context('./', true, /^\.\/modules\/\w+\.js$/))
// }
