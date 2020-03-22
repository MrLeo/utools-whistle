const throwIfEmpty = paramName => {
  throw new Error(`缺少参数 ${paramName}`)
}

/**
 * response
 *
 * @export
 * @param {*} res axios返回结果
 * @param {*} config
 *  - message: notification message
 *  - description: notification description
 * @param {*} handler
 * @returns
 */
export function response(res = throwIfEmpty(), ...args) {
  let config = { message: '', description: '' }
  let handler = () => {}

  const argHandler = {
    // eslint-disable-next-line
    '[object String]': function(param) {
      config = { ...config, message: param }
    },
    // eslint-disable-next-line
    '[object Object]': function(param) {
      config = { ...config, ...param }
    },
    // eslint-disable-next-line
    '[object Function]': function(param) {
      handler = param
    }
  }

  const argsLenHandler = [
    () => {},
    () => {
      argHandler[Object.prototype.toString.call(args[0])](args[0])
    },
    () => {
      argHandler[Object.prototype.toString.call(args[0])](args[0])
      argHandler[Object.prototype.toString.call(args[1])](args[1])
    }
  ]
  argsLenHandler[args.length]()

  if (res instanceof Error || Object.prototype.toString.call(res) === '[object Error]') {
    console.error({
      message: config.message || '服务器内部错误，请稍后再试',
      description: config.description || res.message
    })
    handler(res)
    return Promise.reject(res)
  }

  /* eslint-disable eqeqeq */
  if (res.code != 200) {
    return Promise.reject(res)
  }

  handler(res.data)
  return res
}
