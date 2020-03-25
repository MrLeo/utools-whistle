// https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE

const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: './',
  configureWebpack: config => {
    return {
      plugins: [
        new CopyWebpackPlugin([{ from: './README.md' }]),
        new CopyWebpackPlugin([{ from: './preload/', to: 'preload/' }])
      ]
    }
  },
  chainWebpack: config => {
    // 设置路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('store', resolve('src/store'))
      .set('constants', resolve('src/constants'))
      .set('utils', resolve('src/utils'))
  }
}
