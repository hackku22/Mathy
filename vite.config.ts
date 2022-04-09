import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000/',
            },
        },
    },
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),

        quasar({
            sassVariables: 'src/quasar-variables.sass',
        })],
})
