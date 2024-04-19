// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
const outputOption = {
  sourcemap: false, // 生成 source map
  globals: {
    _: 'lodash-es'
  }
}
export default {
  input: './src/index.ts', // 入口文件路径
  output: [
    {
      name: '@fullsize/echarts',
      file: './lib/index.js', // 输出文件路径
      format: 'es', // 输出模块格式为 CommonJS
      ...outputOption
    },
    {
      name: '@fullsize/echarts',
      file: './lib/index.umd.js', // 输出文件路径
      format: 'umd', // 输出模块格式为 CommonJS
      ...outputOption
    }
  ],
  plugins: [
    typescript(), // 使用 Rollup 插件处理 TypeScript
    terser(),
    resolve()
  ],
  external: ['echarts'], // 将 react 设置为外部依赖，不会打包到最终文件中
};
