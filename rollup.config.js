// https://juejin.im/post/5a9fe754f265da237d028f37

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './preload/main.js',
  output: {
    file: './public/preload.js',
    format: 'cjs'
  },
  watch: {
    exclude: 'node_modules/**'
  },
  plugins: [resolve(), commonjs()]
}
