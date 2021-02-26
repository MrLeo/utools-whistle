const { remote, shell } = require('electron')
const path = require('path')

// const currentWin = remote.getCurrentWindow()
const currentWeb = remote.getCurrentWebContents()

/**
 * 处理新窗口打开
 */
currentWeb.on('new-window', (event, url, frameName, disposition, options) => {
  console.log(`[LOG]: window.webview -> new-window`, event, url, frameName, disposition, options)
  event.preventDefault()

  if (!options.webContents) {
    // shell.openExternal(url)
    try {
      let win = new remote.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
          webSecurity: false,
          preload: path.join(__dirname, 'browser-window.js')
        }
      })

      // 开发打开BrowserWindow控制台
      win.webContents.openDevTools()
      win.loadURL(url)
    } catch (err) {
      window.utools.ubrowser
        .devTools('bottom')
        .goto(url)
        .run({ width: 1200, height: 800 })
    }
  }
})
