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
import { Quasar } from 'quasar'

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
import { createAuth0 } from '@auth0/auth0-vue'

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
    plugins: {}, // import Quasar plugins and add here
})

app.use(
    createAuth0({
        domain: 'dev-ge84r-eu.us.auth0.com',
        client_id: 'zHjZGg1uPws0DkQg5bRdKcDX8m6AuTZl', // eslint-disable-line camelcase
        redirect_uri: window.location.origin + '/api/login/callback', // eslint-disable-line camelcase
    }),
)

app.use(router)

app.use(DraggablePlugin)
app.mount('#app')
