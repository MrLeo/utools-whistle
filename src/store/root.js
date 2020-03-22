/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @LastEditors: pan.changzhi
 * @version: 0.0.0
 * @Description: 当前登录用户相关信息
 * @Date: 2019-04-04 20:28:11
 * @LastEditTime: 2019-06-14 11:31:44
 */
import { mutations } from './utils/mutation-types'
import { response } from './utils/response-handler'
import { Http } from '../utils/http'

export function initStates() {
  return {
    at: '',
    rt: ''
  }
}

export default function() {
  const http = new Http()
  const states = initStates()

  return {
    state: states,
    getters: {},
    mutations: mutations(states),
    actions: {
      // #region openCompany - 开通公司
      /** 开通公司
       * {@link http://172.17.90.59:40001/project/156/interface/api/279 }
       */
      async openCompany() {
        const res = await http.post(`/rd/bolemiddleware/company/open`, ['wepinapplet'])
        return response(res, { message: `公司开通失败，请联系管理员` })
      }
      // #endregion
    }
  }
}
