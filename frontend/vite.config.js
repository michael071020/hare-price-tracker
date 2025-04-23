import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content.js'),
        options: resolve(__dirname, 'options.html')
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'content') {
            return 'content.js'; // 給 manifest 用
          }
          return 'assets/[name].js'; // 其他保持預設方式
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
