import { createApp } from 'vue'
import App from './App.vue'
import { DraggablePlugin } from '@braks/revue-draggable'
import { createAuth0 } from '@auth0/auth0-vue'
import router from './router'

import 'vuetify/styles' // Global CSS has to be imported
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
      }
}) // Replaces new Vuetify(...)
app.use(vuetify)

app.use(
    createAuth0({
        domain: 'dev-ge84r-eu.us.auth0.com',
        client_id: 'zHjZGg1uPws0DkQg5bRdKcDX8m6AuTZl', // eslint-disable-line camelcase
        redirect_uri: window.location.origin, // eslint-disable-line camelcase
    }),
)

app.use(router)

app.use(DraggablePlugin)
app.mount('#app')
