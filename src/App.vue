<script setup lang="ts">
import Home from "./pages/Home.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { MathStatement } from "./support/parse";
import { MathPage } from "./support/page";
import { onMounted, ref } from "vue";
import { checkLoggedIn, loggedOut, loggedIn } from "./support/auth";
import router from "./router";

(window as any).Stmt = MathStatement;
(window as any).Pg = MathPage;

const status = ref(checkLoggedIn())

; (async () => {
    const response = await fetch('/api/login/status/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    const res = (await response.json()) as unknown as any
    if (res.data.hasUser) {
      loggedIn()
    }
    status.value = checkLoggedIn()
  })()

onMounted(() => {
  status.value = checkLoggedIn()
  console.log(status.value)
})

router.afterEach(() => {
  status.value = checkLoggedIn()
  console.log(status.value)
})

const logout = async () => {
  const response = await fetch('/api/logout/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  })
  loggedOut()
  status.value = checkLoggedIn()
  router.push({path: '/'})
}

</script>

<template>
  <q-layout view="hHr LpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>Title
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs>
        <q-route-tab to="/Scratch" label="Scratch" />
        <q-route-tab to="/Editor" label="Editor" />
        <q-tab v-if="status" @click="logout()" label="Logout" />
      </q-tabs>
    </q-header>

    <q-page-container style="display: flex;padding-top: 20px;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
body {
  margin-top: 0px;
  height: 100%;
  background: #1e2361;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4484c4;
  margin-top: 60px;
}
</style>
