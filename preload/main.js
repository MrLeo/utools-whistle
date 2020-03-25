/* eslint-disable no-unused-vars */
// https://u.tools/docs/developer/preload.html
// 可以在此文件内调用uTools 、nodejs、electron提供的api
// 开发者可以暴露自定义API供后加载脚本使用

const ip = require('ip')
const Base64 = require('js-base64').Base64
var QRCode = require('qrcode')

// import { ip, Base64, QRCode } from './modules'

window.getQrCode = async function() {
  const address = `${ip.address()}:8899`
  const ss = `http://${Base64.encode(address).replace(/=+$/, '')}#w2`
  const qrcode = await QRCode.toDataURL(ss)

  return {
    address,
    ss,
    qrcode
  }
}
