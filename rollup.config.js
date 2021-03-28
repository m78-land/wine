import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';
import path from 'path';
import { externalsDependencies } from './config/getExternals';

const DIST = 'dist';

const common = {
  input: ['src/index.ts'],
};

const outputCommon = {
  dir: DIST,
};

const pluginsCommon = [
  nodeResolve(),
  typescript({
    tsconfig: './tsconfig.lib.json',
  }),
  commonjs(),
  postcss({
    // extract: true,     // 根据chunk名输出到外部
    // extract: true,
    extract: path.resolve(__dirname, './dist/style.css'),
    modules: {}, // 支持通过 xx.module.css 格式使用 css modules
    plugins: [],
    extensions: ['.css', 'scss', 'sass'],
    // sourceMap: true,   // or inline
  }),
];

export default [
  {
    ...common,
    external: externalsDependencies(),
    plugins: [
      del({
        targets: 'dist/*',
      }),
      ...pluginsCommon,
    ],
    output: {
      ...outputCommon,
      entryFileNames: '[name].js',
      format: 'es',
    },
  },
  // {
  //   ...common,
  //   // umd的外部化包手动添加，通常组会排除主要依赖，如react，react-dom等
  //   external: [
  //     'react',
  //     'react-dom'
  //   ],
  //   plugins: pluginsCommon,
  //   output: {
  //     ...outputCommon,
  //     format: 'umd',
  //     entryFileNames: '[name].[format].js',
  //     name: 'RollupPlay',
  //     globals: {
  //       React: 'React',
  //       ReactDom: 'ReactDom',
  //     },
  //   },
  // },
];
