// http://rollupjs.org/guide/en/
// https://juejin.im/post/5a9fe754f265da237d028f37
// http://www.sosout.com/2018/08/04/rollup-tutorial.html

const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')

module.exports = [
  {
    input: './preload/lib/fix-path.js',
    output: {
      file: './preload/lib/output/fix-path.js',
      format: 'cjs'
    },
    watch: { exclude: 'node_modules/**' },
    plugins: [commonjs(), resolve(), json()]
  },
  {
    input: './preload/lib/ip.js',
    output: {
      file: './preload/lib/output/ip.js',
      format: 'cjs'
    },
    watch: { exclude: 'node_modules/**' },
    plugins: [commonjs(), resolve(), json()]
  },
  {
    input: './preload/lib/base64.js',
    output: {
      file: './preload/lib/output/base64.js',
      format: 'cjs'
    },
    watch: { exclude: 'node_modules/**' },
    plugins: [commonjs(), resolve(), json()]
  },
  {
    input: './preload/lib/qrcode.js',
    output: {
      file: './preload/lib/output/qrcode.js',
      format: 'cjs'
    },
    watch: { exclude: 'node_modules/**' },
    plugins: [commonjs(), resolve(), json()]
  }
]
