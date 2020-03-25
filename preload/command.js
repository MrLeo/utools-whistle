/* eslint-disable no-unused-vars */
const child = require('child_process')

const logPrefix = '[command]'
const isWindows = process.platform !== 'darwin'

function exec(command, options) {
  return new Promise((resolve, reject) => {
    child.exec(
      command,
      Object.assign(
        {
          shell: isWindows ? 'cmd.exe' : '/bin/bash'
        },
        options,
        { timeout: 3600 * 1000 }
      ),
      (error, stdout, stderr) => {
        if (error) {
          console.error(`${logPrefix} ${error.stack}`)
          return resolve({
            command,
            success: false,
            data: '',
            message: error.stack
          })
        }

        return resolve({
          command,
          success: true,
          data: stdout,
          message: '执行命令成功'
        })
      }
    )
  })
}

function longExec(command, options) {
  const commandParseArr = command.split(' ').filter(item => item)
  const childProcess = child.spawn(
    commandParseArr[0],
    commandParseArr.slice(1),
    Object.assign(
      {
        shell: isWindows ? true : '/bin/bash'
      },
      options
    )
  )

  return childProcess
}

module.exports = {
  exec,
  longExec
}
