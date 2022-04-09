import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from '@vuetify/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000/',
            },
        },
    },
    plugins: [vue(),
        vuetify({ autoImport: true }), // Enabled by default
    ],
})
