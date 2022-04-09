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
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/scratch">Scratch Testing</router-link>
  </div>
  <router-view/>
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

</style>
