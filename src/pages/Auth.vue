<script setup lang="ts">

import { useAuth0 } from '@auth0/auth0-vue';
import router from '../router';

const { user, isAuthenticated, logout } = useAuth0();
isAuthenticated
const route = router.resolve({ path: '/'})
const absoluteURL = new URL(route.href, window.location.href).href
const leave = () => logout({ returnTo: absoluteURL })

</script>
<template>
    <div>
        <h2>User Profile</h2>
         <code>{{ user }}</code>
         <button @click="leave">Log out</button>
    </div>
</template>
