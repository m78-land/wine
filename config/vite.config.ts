import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@m78/wine': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: 'example',
  }
});
