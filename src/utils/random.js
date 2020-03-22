/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @LastEditors: Leo
 * @version: 0.0.0
 * @Description:
 * @Date: 2019-03-29 17:19:56
 * @LastEditTime: 2019-03-29 17:21:34
 */

// #region 返回一个随机的自然数（大于等于 0 的整数）
/**
 * 返回一个随机的自然数（大于等于 0 的整数）
 *
 * @export
 * @param {*} min 默认：0
 * @param {*} max 默认：9007199254740992 （2^53）
 * @returns
 */
export function natural(min = 0, max = 9007199254740992) {
  return Math.round(Math.random() * (max - min)) + min
}
// #endregion

// #region 返回一个随机的整数。
/**
 * 返回一个随机的整数。
 *
 * @export
 * @param {*} min 默认：-9007199254740992
 * @param {*} max 默认：9007199254740992（2^53）
 * @returns
 */
export function integer(min = -9007199254740992, max = 9007199254740992) {
  return Math.round(Math.random() * (max - min)) + min
}
// #endregion

// #region 返回一个随机的浮点数。
/**
 * 返回一个随机的浮点数。
 *
 * @export
 * @param {*} min
 * @param {*} max
 * @param {*} dmin
 * @param {*} dmax
 * @returns
 */
export function float(min, max, dmin = 0, dmax = 17) {
  let ret = `${this.integer(min, max)}.`
  for (
    let i = 0,
      dcount = this.natural(Math.max(Math.min(dmin, 17), 0), Math.max(Math.min(dmax, 17), 0));
    i < dcount;
    i++
  ) {
    ret +=
      // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
      i < dcount - 1 ? this.character('number') : this.character('123456789')
  }
  return parseFloat(ret, 10)
}
// #endregion

// #region 返回一个随机字符。
/**
 * 返回一个随机字符。
 *
 * @export
 * @param {*} pool
 * @returns
 */
export function character(pool) {
  const pools = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '!@#$%^&*()[]'
  }
  pools.alpha = pools.lower + pools.upper
  pools.undefined = pools.lower + pools.upper + pools.number + pools.symbol

  const newPool = pools[`${pool}`.toLowerCase()] || pool
  return newPool.charAt(this.natural(0, newPool.length - 1))
}
// #endregion

// #region 返回一个随机字符串。
/**
 * 返回一个随机字符串。
 * 或从npm下载[chinese-random-ip](https://github.com/taliu/chinese-random-ip)
 *
 * @export
 * @param {*} pool
 * @param {*} min
 * @param {*} max
 * @returns
 */
export function string(pool, min, max) {
  let len
  switch (arguments.length) {
    case 0: // ()
      len = this.natural(3, 7)
      break
    case 1: // ( length )
      len = pool
      pool = undefined // eslint-disable-line
      break
    case 2:
      // ( pool, length )
      // eslint-disable-next-line
      if (typeof arguments[0] === 'string') {
        len = min
      } else {
        // ( min, max )
        len = this.natural(pool, min)
        pool = undefined // eslint-disable-line
      }
      break
    case 3:
      len = this.natural(min, max)
      break
    default:
      len = this.natural(3, 7)
  }

  let text = ''
  for (let i = 0; i < len; i++) {
    text += this.character(pool)
  }

  return text
}
// #endregion

// #region 返回一个整型数组。
/**
 * 返回一个整型数组。
 *
 * @export
 * @param {*} start
 * @param {*} stop
 * @param {*} step
 * @returns
 */
export function range(start, stop, step) {
  // range( stop )
  if (arguments.length <= 1) {
    stop = start || 0 // eslint-disable-line
    start = 0 // eslint-disable-line
  }
  // range( start, stop )
  step = arguments[2] || 1 // eslint-disable-line

  start = +start // eslint-disable-line
  stop = +stop // eslint-disable-line
  step = +step // eslint-disable-line

  const len = Math.max(Math.ceil((stop - start) / step), 0)
  let idx = 0
  const rangeArr = new Array(len)

  while (idx < len) {
    rangeArr[idx++] = start
    start += step // eslint-disable-line
  }

  return rangeArr
}
// #endregion

// #region 获取随机IP
/**
 * 获取随机IP
 *
 * @export
 * @returns
 */
export function ip() {
  return `${natural(0, 255)}.${natural(0, 255)}.${natural(0, 255)}.${natural(0, 255)}`
}
// #endregion

/**
 * https://sourcegraph.com/github.com/nuysoft/Mock@refactoring/-/blob/src/mock/random/basic.js
 */
export default {
  natural,
  integer,
  float,
  character,
  string,
  range
}
