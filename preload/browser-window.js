const { remote, shell } = require('electron')

// const currentWin = remote.getCurrentWindow()
const currentWeb = remote.getCurrentWebContents()

/**
 * 处理新窗口打开
 */
currentWeb.on('new-window', (event, url, frameName, disposition, options) => {
  console.log(`[LOG]: window.webview -> new-window`, event, url, frameName, disposition, options)
  event.preventDefault()

  if (!options.webContents) {
    shell.openExternal(url)
  }
})
