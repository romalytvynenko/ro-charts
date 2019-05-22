// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import { uglify } from 'rollup-plugin-uglify'

const format = process.env.FORMAT || 'umd'
const production = process.env.PRODUCTION || false
const isEsmModuleFormat = format === 'esm'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/ro-charts.' + format + '.js',
    format: format,
    name: 'roCharts'
  },
  plugins: [
    !production || isEsmModuleFormat ? serve() : {},
    production && !isEsmModuleFormat ? uglify() : {},
    resolve(),
    babel({
      'presets': isEsmModuleFormat ? [] : [
        ['@babel/env', {'modules': false}]
      ],
    }),
  ]
}
