/*
 * @Author: xuebin.me
 * @Date: 2019-01-07 13:22:01
 * @LastEditTime: 2019-08-22 18:34:39
 * @version: 0.0.0
 * @Description:
 * 孤独升级垒码，大战产品泪下，
 * 合作开发互掐，夕阳西下，码奴人在天涯
 */
/**
 **************************************************************
 *                                                            *
 *   .=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.       *
 *    |                     ______                     |      *
 *    |                  .-"      "-.                  |      *
 *    |                 /            \                 |      *
 *    |     _          |              |          _     |      *
 *    |    ( \         |,  .-.  .-.  ,|         / )    |      *
 *    |     > "=._     | )(__/  \__)( |     _.=" <     |      *
 *    |    (_/"=._"=._ |/     /\     \| _.="_.="\_)    |      *
 *    |           "=._"(_     ^^     _)"_.="           |      *
 *    |               "=\__|IIIIII|__/="               |      *
 *    |              _.="| \IIIIII/ |"=._              |      *
 *    |    _     _.="_.="\          /"=._"=._     _    |      *
 *    |   ( \_.="_.="     `--------`     "=._"=._/ )   |      *
 *    |    > _.="                            "=._ <    |      *
 *    |   (_/                                    \_)   |      *
 *    |                                                |      *
 *    '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-='      *
 *                                                            *
 *           LASCIATE OGNI SPERANZA, VOI CH'ENTRATE           *
 *                （译文：进来的人，放弃一切希望）                  *
 **************************************************************
 */

import axios from 'axios'

// #region Http
/**
 * Http
 *
 * @export
 * @class Http
 */
export class Http {
  constructor(option = { headers: {} }) {
    const { headers, options } = option
    this.config = {
      // baseURL: ENV.api,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers
      },
      ...options
    }

    // 本地开发接口请求使用whistlejs代理配置
    // if (process.env.NODE_ENV !== 'production') {
    //   this.config.proxy = {
    //     host: '127.0.0.1',
    //     port: 8899
    //   }
    // }

    // #region response status: 请求已发出，但是不在2xx的范围
    this.statusCode = {
      404: '404,错误请求',
      401: '未授权，请重新登录',
      403: '禁止访问',
      408: '请求超时',
      500: '服务器内部错误',
      501: '功能未实现',
      502: '服务不可用',
      503: '服务不可用',
      504: '网关错误',
      510: '服务器内部错误'
    }
    // #endregion

    this.instance = axios.create(this.config)

    this.requestUse()
    this.responseUse()

    return this.instance
  }

  resHandler(res) {
    const status = res?.data?.code || res?.status || res?.response?.status || res?.request?.status
    const errorInfo = this.statusCode[status]

    // const url = window.location;
    // const bkurl = encodeURIComponent(url.href);

    // ! 如果以下 code 的错误信息不需要提示可在 {@link store/utils/response-handler.js} 中添加忽略
    const errorHandler = {}

    return errorHandler[status]?.() || (errorInfo&&Promise.reject(new Error(errorInfo))) || res?.data || res // eslint-disable-line
  }

  // #region 请求拦截器
  requestUse() {
    this.instance.interceptors.request.use(
      config => {
        console.info(`🔊 【请求拦截器】 -> ${config?.url}`, config)
        return config
      },
      error => {
        console.info('🔊 【请求拦截器】 -> error', error)
        return error
      }
    )
  }
  // #endregion

  // #region 响应拦截器
  responseUse() {
    this.instance.interceptors.response.use(
      res => {
        console.info(`🔊 【响应拦截器】 -> ${res?.config?.url}`, res)
        return this.resHandler(res)
      },
      res => {
        console.info(`🔊 【响应拦截器】 -> error -> ${res?.config?.url}`, res)
        return this.resHandler(res)
      }
    )
  }
  // #endregion
}
// #endregion

// #region HttpBlob
/**
 * 返回blob文件流
 * @export
 * @class HttpBlob
 * @extends {Http}
 */
export class HttpBlob extends Http {
  constructor(
    option = {
      responseType: 'blob'
    }
  ) {
    super(option)
    return this.instance
  }
}
// #endregion
