import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),

    Components({
      dirs: ['src/components'], // где искать компоненты
      extensions: ['vue'],
      deep: true,
    }),

    AutoImport({
      imports: ['vue', 'pinia'],
      dts: 'src/auto-imports.d.ts', // типы
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
