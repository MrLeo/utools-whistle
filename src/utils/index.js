/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @LastEditors: Please set LastEditors
 * @version: 0.0.0
 * @Description:
 * @Date: 2019-02-26 13:07:46
 * @LastEditTime: 2019-09-12 13:31:58
 */

// #region compose - 函数式编程
/* eslint-disable */
/**
 * compose
 * @param  {...any} fns
 * @example compose(fun1, fun2, fun3)()
 */
export const compose = (...fns) => (...args) =>
  fns.reduceRight((val, fn) => fn.apply(null, [].concat(val)), args)
/* eslint-enable */
// #endregion

// #region dateRange - 是不是合适日期的范围
/**
 * 是不是合适日期的范围
 * @param {*} date1
 * @param {*} date2
 */
export const dateRange = (date1, date2) => {
  let oldDate = new Date(date1)
  let newD = new Date(date2)
  let date = new Date()
  let nowStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  let nowDate = new Date(nowStr)
  if (oldDate < nowDate && nowDate < newD) {
    return true
  } else {
    return false
  }
}

// #endregion

// #region throwIfMiss
export const throwIfMiss = paramName => {
  throw new Error(`参数错误${paramName ? ': ' : ''}${paramName}`)
}
// #endregion

// #region inBrowser - 判断是否是浏览器
/**
 * inBrowser 通过判断 `window` 对象是否存在即可
 */
export const inBrowser = typeof window !== 'undefined'
// #endregion

// #region isIE/isIE9/isEdge/isChrome - 浏览器判断
// IE浏览器判断
export const isIE = UA && /msie|trident/.test(UA)
// IE9
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
// Edge
export const isEdge = UA && UA.indexOf('edge/') > 0
// Chrome
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
// #endregion

// #region 判断是否微信开发者工具
export function isWechatdevtools() {
  if (inBrowser) {
    // 微信开发者工具
    if (/(wechatdevtools)/i.test(navigator.userAgent)) {
      return true
    }
  }
  return false
}
// #endregion

// #region UA
/**
 * UA: toLowerCase目的是 为了后续的各种环境检测
 */
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
// #endregion

// #region hasProto
/**
 * hasProto
 * 一个对象的 __proto__ 属性指向了其构造函数的原型
 * 从一个空的对象字面量开始沿着原型链逐级检查。
 */
export const hasProto = '__proto__' in {}
// #endregion

// #region isObject
/**
 * isObject: 区分对象和原始值
 * @param {*} obj
 */
export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
// #endregion

// #region camelize - 连字符转驼峰
/**
 * camelize: 连字符转驼峰
 * @param {*} str
 */
export const camelize = cached(str => str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : '')))
// #endregion

// #region capitalize - 首字符大写
/**
 * capitalize:首字符大写
 * @param {*} str
 */
export const capitalize = cached(str => str.charAt(0).toUpperCase() + str.slice(1))
export const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')
// #endregion

// #region hyphenate - 驼峰转连字符
/**
 * hyphenate:驼峰转连字符
 * @param {*} str
 */
export const hyphenate = cached(str => str.replace(/\B([A-Z])/g, '-$1').toLowerCase())
// #endregion

// #region checkCookie - 检测是否支持cookie
/**
 * 检测是否支持cookie
 * @export
 * @returns
 */
export function checkCookie() {
  if (!navigator.cookieEnabled) {
    alert('您的浏览器不支持cookie将无法登录，请使用其他浏览器') // eslint-disable-line
    return false
  }
  return true
}
// #endregion

// #region cache - 创建一个缓存函数
/**
 * Create a cached version of a pure function.
 */
export function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}
// #endregion

// #region once - 只调用一次的函数
/**
 * once:只调用一次的函数
 *
 * @export
 * @param {*} fn
 * @returns
 */
export function once(fn) {
  let called = false
  return function newFn(...args) {
    if (!called) {
      called = true
      fn.apply(this, args)
    }
  }
}
// #endregion

// #region isReserved - 检测字符串是否以 $ 或者 _ 开头
/**
 * isReserved：检测字符串是否以 $ 或者 _ 开头
 * @export
 * @param {*} str
 * @returns
 */
export function isReserved(str) {
  const c = `${str}`.charCodeAt(0) // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
  return c === 0x24 || c === 0x5f
}
// #endregion

// #region fearNotLetter - 超早缺失字母
/**
 * 从传递进来的字母序列中找到缺失的字母并返回它。 如：fearNotLetter("abce") 应该返回 "d"。
 * @param {*} str
 * @returns
 */
export function fearNotLetter(str) {
  // 将字符串转为ASCII码，并存入数组
  const arr = []
  for (let i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i))
  }
  for (let j = 1; j < arr.length; j++) {
    const num = arr[j] - arr[j - 1]
    // 判断后一项减前一项是否为1，若不为1，则缺失该字符的前一项
    if (num !== 1) {
      // 将缺失字符ASCII转为字符并返回
      return String.fromCharCode(arr[j] - 1)
    }
  }
  return undefined
}
// #endregion

// #region toString - 将给定变量的值转换为 string 类型并返回
/**
 * toString: 将给定变量的值转换为 string 类型并返回
 *
 * @export
 * @param {*} val
 * @returns
 */
export function toString(val) {
  return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val) // eslint-disable-line
}
// #endregion

// #region looseEqual - 检查两个值是否相等
/**
 * looseEqual: 检查两个值是否相等
 *
 * @export
 * @param {*} a
 * @param {*} b
 * @returns
 */
export function looseEqual(a, b) {
  // 当 a === b 时，返回true
  if (a === b) return true
  // 否则进入isObject判断
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  // 判断是否都为Object类型
  if (isObjectA && isObjectB) {
    try {
      // 调用 Array.isArray() 方法，再次进行判断
      // isObject 不能区分是真数组还是对象（typeof）
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      // 判断是否都为数组
      if (isArrayA && isArrayB) {
        // 对比a、bs数组的长度
        return a.length === b.length && a.every((e, i) => looseEqual(e, b[i])) // 调用 looseEqual 进入递归
      }
      if (!isArrayA && !isArrayB) {
        // 均不为数组，获取a、b对象的key集合
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        // 对比a、b对象的key集合长度
        // 长度相等，则调用 looseEqual 进入递归
        return keysA.length === keysB.length && keysA.every(key => looseEqual(a[key], b[key])) // eslint-disable-line
      }
      // 如果a、b中一个是数组，一个是对象，直接返回 false
      /* istanbul ignore next */
      return false
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}
// #endregion

// #region downloadFile - 下载文件流
/**
 * 下载文件
 * @param {*} url 文件地址
 * @param {*} filename 文件名
 */
export function downloadFile(url = '', filename = '') {
  if (!url) return

  // 创建隐藏的可下载链接
  const link = document.createElement('a')
  link.download = filename
  link.style.display = 'none'
  // link.target = '_blank'
  link.href = url

  // 触发点击
  document.body.appendChild(link)
  link.click()

  // 然后移除
  document.body.removeChild(link)
}
// #endregion

// #region downloadFileByBlob - 下载blob文件
/**
 * 下载blob文件
 * @param {*} blob 文件blob对象
 * @param {*} filename 文件名
 */
export function downloadFileByBlob(blob = null, filename = '') {
  if (!blob) return

  // 创建隐藏的可下载链接
  const link = document.createElement('a')
  link.download = filename
  link.style.display = 'none'

  link.href = URL.createObjectURL(blob)

  // 触发点击
  document.body.appendChild(link)
  link.click()

  // 然后移除
  document.body.removeChild(link)
}
// #endregion

// #region remoteLoad - 动态脚本加载
/**
 * 动态脚本加载
 * @param {*} url
 * @param {*} hasCallback
 */
export function remoteLoad(url, hasCallback) {
  return createScript(url)
  /**
   * 创建script
   * @param url
   * @returns {Promise}
   */
  function createScript(url) {
    var scriptElement = document.createElement('script')
    document.body.appendChild(scriptElement)
    var promise = new Promise((resolve, reject) => {
      scriptElement.addEventListener(
        'load',
        e => {
          removeScript(scriptElement)
          if (!hasCallback) {
            resolve(e)
          }
        },
        false
      )

      scriptElement.addEventListener(
        'error',
        e => {
          removeScript(scriptElement)
          reject(e)
        },
        false
      )

      if (hasCallback) {
        window.____callback____ = function() {
          resolve()
          window.____callback____ = null
        }
      }
    })

    if (hasCallback) {
      url += '&callback=____callback____'
    }

    scriptElement.src = url

    return promise
  }

  /**
   * 移除script标签
   * @param scriptElement script dom
   */
  function removeScript(scriptElement) {
    document.body.removeChild(scriptElement)
  }
}
// #endregion

// #region 检测手机号合法
/**
 * @param {string} tel
 */
export function checktel(tel) {
  return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(tel)
}
// #endregion

// #region 检测Email
export function checkEmail(email) {
  const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
  return reg.test(email)
}
// #endregion

// #region goBack - 返回前一页（或关闭本页面）
/* eslint-disable */
/**
 * 返回前一页（或关闭本页面）
 * 如果没有前一页历史，则直接关闭当前页面
 */
export function goBack() {
  if (navigator.userAgent.indexOf('MSIE') >= 0 && navigator.userAgent.indexOf('Opera') < 0) {
    // IE
    if (history.length > 0) {
      window.history.go(-1)
    } else {
      window.opener = null
      window.close()
    }
  } else {
    // 非IE浏览器
    if (
      navigator.userAgent.indexOf('Firefox') >= 0 ||
      navigator.userAgent.indexOf('Opera') >= 0 ||
      navigator.userAgent.indexOf('Safari') >= 0 ||
      navigator.userAgent.indexOf('Chrome') >= 0 ||
      navigator.userAgent.indexOf('WebKit') >= 0
    ) {
      if (window.history.length > 1) {
        window.history.go(-1)
      } else {
        window.opener = null
        window.close()
      }
    } else {
      // 未知的浏览器
      window.history.go(-1)
    }
  }
}
/* eslint-enable */
// #endregion

// #region addFirstUpperCaseToPrototype - String原型链方法firstUpperCase
/**
 * String原型链方法firstUpperCase
 * @export
 */
export function addFirstUpperCaseToPrototype() {
  /* eslint-disable */
  String.prototype.firstUpperCase = function() {
    return (([first, ...rest]) => first.toUpperCase() + rest.join(''))(this) // return this.replace(/^\S/, s => s.toUpperCase())
  }
  /* eslint-enable */
}
// #endregion

// #region addFlatToPrototype - Array原型链方法flat
/**
 * Array原型链方法flat
 * @export
 */
export function addFlatToPrototype() {
  /* eslint-disable */
  if (!Array.prototype.flat) {
    Array.prototype.flat = function(num = 1) {
      if (!Number(num) || Number(num) < 0) {
        return this
      }
      let arr = []
      this.forEach(item => {
        if (Array.isArray(item)) {
          arr = arr.concat(item.flat(--num))
        } else {
          arr.push(item)
        }
      })
      return arr
    }
  }
  /* eslint-enable */
}
// #endregion

// #region 节流
export function throttle(fn, delay) {
  let timer
  return () => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn()
      clearTimeout(timer)
      timer = null // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
    }, delay)
  }
}
// #endregion
