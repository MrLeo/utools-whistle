// https://u.tools/docs/developer/preload.html
// 可以在此文件内调用uTools 、nodejs、electron提供的api
// 开发者可以暴露自定义API供后加载脚本使用

// const { readFileSync } = require("fs");
// window.readConfig = function() {
//   const data = readFileSync("./dist/index.html");
//   return data;
// };
// console.log(window.readConfig()); // index.html 后加载的内容可以使用window.readConfig()方法，但不能使用Node.js特性

const ip = require("ip");
const Base64 = require("js-base64").Base64;
var QRCode = require("qrcode");

window.getQrCode = async function() {
  const address = `${ip.address()}:8899`;
  const ss = `http://${Base64.encode(address).replace(/=+$/, "")}#w2`;
  const qrcode = await QRCode.toDataURL(ss);

  return {
    address,
    ss,
    qrcode
  };
};
