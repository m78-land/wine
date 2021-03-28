import * as path from "path";

export default {
  base: '/wine/',
  publicPath: '/wine/',
  outputPath: 'docs',
  title: 'Wine',
  description: 'browser task window library',
  logo: 'https://gitee.com/llixianjie/m78/raw/master/public/logo.png',
  mode: 'doc',
  resolve: {
    includes: [path.resolve(__dirname, '../src/docs'), '../README.md'],
  },
  alias: {
    '@m78/wine': path.resolve(__dirname, '../src/index.ts'),
  },
  dynamicImport: {},
  exportStatic: {},
}
