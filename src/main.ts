import { createApp } from 'vue'
import App from './App.vue'
import { DraggablePlugin } from '@braks/revue-draggable'
import { createAuth0 } from '@auth0/auth0-vue'


const app = createApp(App)

app.use(
    createAuth0({
        domain: 'dev-ge84r-eu.us.auth0.com',
        client_id: 'zHjZGg1uPws0DkQg5bRdKcDX8m6AuTZl', // eslint-disable-line camelcase
        redirect_uri: window.location.origin, // eslint-disable-line camelcase
    }),
)

app.use(DraggablePlugin)
app.mount('#app')
