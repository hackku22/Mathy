import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Login.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/scratch',
        name: 'Scratch',
        component: () => import(/* webpackChunkName: "scratch" */ './pages/Scratch.vue'),
    },
    {
        path: '/editor',
        name: 'Editor',
        component: () => import(/* webpackChunkName: "Editor" */ './pages/Editor.vue'),
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router
