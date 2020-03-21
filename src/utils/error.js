/*
 * @Company: 智联招聘
 * @Author: xuebin.me
 * @Date: 2019-01-03 14:14:41
 * @LastEditors: Leo
 * @LastEditTime: 2019-01-07 13:28:40
 * @version: 0.0.0
 * @Description:
 */

/**
 * ZPError
 * @class ZPError
 * @extends {Error}
 */
class ZPError extends Error {
  /**
   *Creates an instance of ZPError.
   * @param {*} { code, message, taskId }
   * - code: 状态码
   * - message: 错误信息
   * - taskId: 请求唯一标识
   * @memberof ZPError
   */
  constructor({ code, message, taskId }) {
    // Calling parent constrcutor of base Error class.
    super(message);
    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    this.code = code || 500;
    this.taskId = taskId || "";
  }
}

export default ZPError;
