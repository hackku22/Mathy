/*
--------------------------------------------------
                    Vue Helpers
--------------------------------------------------
*/
import { createApp } from 'vue'

import router from './router'

/*
--------------------------------------------------
                    App UI
--------------------------------------------------
*/
import { Dark, Quasar  } from 'quasar'

// Import icon libraries
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// A few examples for animations from Animate.css:
import '@quasar/extras/animate/fadeInUp.css'
import '@quasar/extras/animate/fadeOutUp.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

/*
--------------------------------------------------
                    Plugins
--------------------------------------------------
*/
import { DraggablePlugin } from '@braks/revue-draggable'

import 'katex/dist/katex.min.css'
import 'katex/dist/contrib/auto-render.min'

/*
--------------------------------------------------
                    Components
--------------------------------------------------
*/
import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
    plugins: {Dark}, // import Quasar plugins and add here
    config: {
        brand: {
            primary: '#553564',
            secondary: '#7da9b2',
            accent: '#9C27B0',

            dark: '#1d1d1d',

            positive: '#21BA45',
            negative: '#C10015',
            info: '#31CCEC',
            warning: '#F2C037',
        },
    },
})

app.use(router)

app.use(DraggablePlugin)
app.mount('#app')
