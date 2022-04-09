<script setup lang="ts">
import Home from './components/Home.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import { MathStatement } from './support/parse'
import { MathPage } from './support/page'
(window as any).Stmt = MathStatement
;(window as any).Pg = MathPage
</script>

<template>



   <v-app>
    <v-app-bar height="30" color="grey-darken-3" elevation="0">
      <div id="nav">
        <router-link class="links" to="/">Home</router-link> |
        <router-link class="links" to="/scratch">Scratch Testing</router-link> |
        <router-link class="links" to="/editor">Editor</router-link>
      </div>
    </v-app-bar>

    <v-main>
      <v-card elevation="0" height="400px">
          <router-view/>
      </v-card>
    </v-main>
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.links {
  color: #fff;
}
.links:visited{
  color: #fff;
}
</style>
