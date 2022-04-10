import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'

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
    {
        path: '/editor/:pageId',
        component: () => import(/* webpackChunkName: "Editor" */ './pages/Editor.vue'),
    },
    {
        path: '/listings',
        name: 'Listings',
        component: () => import(/* webpackChunkName: "Listings" */ './pages/Listings.vue'),
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router
