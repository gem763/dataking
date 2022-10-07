import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // viteCommonjs()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // https://github.com/nuxt/vite/issues/160
      // npm i --save-dev rollup-plugin-node-builtins
      fs: require.resolve('rollup-plugin-node-builtins'),
    }
  },
  define: {
    // process is not defined 를 해결하려면 아래를 넣어라
    'process.env': {}
  }
})