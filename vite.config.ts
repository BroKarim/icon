import { join, resolve } from 'node:path'
import process from 'node:process'
import Vue from '@vitejs/plugin-vue'
import dayjs from 'dayjs'
import fg from 'fast-glob'
import { SvgPackerVitePlugin } from 'svg-packer/vite'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
  return {
    plugins: [
      Vue({
        customElement: [
          'iconify-icon',
        ],
        template: {
          compilerOptions: {
            isCustomElement: tag => tag === 'iconify-icon',
          },
        },
      }),
      Pages(),
      Components({
        dts: 'src/components.d.ts',
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
      }),
      SvgPackerVitePlugin(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        manifest: {
          name: 'Icons',
          short_name: 'Icons',
          icons: [
            {
              src: '/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        injectManifest: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        },
        integration: {
          configureOptions(viteConfig, options) {
            if (viteConfig.command === 'build')
              options.includeAssets = fg.sync('**/*.*', { cwd: join(process.cwd(), 'public'), onlyFiles: true })
          },
        },
        devOptions: {
          enabled: process.env.SW_DEV === 'true',
          type: 'module',
          navigateFallback: 'index.html',
        },
      }),
      UnoCSS(),
    ],
    define: {
      __BUILD_TIME__: JSON.stringify(dayjs().format('YYYY/MM/DD HH:mm')),
      PWA: process.env.NODE_ENV === 'production' || process.env.SW_DEV === 'true',
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'iconify-icon': resolve(__dirname, 'node_modules/iconify-icon/dist/iconify-icon.mjs'),
      },
    },
    worker: {
      format: 'es',
      rollupOptions: {
        treeshake: true,
      },
      plugins: () => [
        SvgPackerVitePlugin(),
      ],
    },
    build: {
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router') || id.includes('@vueuse') || id.includes('@unhead')) {
                return 'vendor-vue'
              }
              if (id.includes('reka-ui') || id.includes('floating-vue') || id.includes('vaul-vue')) {
                return 'vendor-ui'
              }
              if (id.includes('iconify') || id.includes('@iconify')) {
                return 'vendor-icons'
              }
            }
            if (id.includes('collections-info.json')) {
              return 'collections-data'
            }
          },
        },
      },
    },
  }
})
