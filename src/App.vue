<script setup lang="ts">
import { MathStatement } from "./support/parse";
import { MathPage } from "./support/page";
(window as any).Stmt = MathStatement;
(window as any).Pg = MathPage;

  theme: {
    defaultTheme: 'dark'
  }
</script>

<template>
  <v-app>
    <v-app-bar height="30" elevation="0">
      <div id="nav">
        <router-link class="links" to="/">Home</router-link> |
        <router-link class="links" to="/scratch">Scratch Testing</router-link> |
        <router-link class="links" to="/editor">Editor</router-link>
      </div>
    </v-app-bar>

    <div style="margin-top: 30px">  <!-- Account for the navbar height -->
      <router-view/>
    </div>
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.links {
  color: #fff;
}
.links:visited {
  color: #fff;
}
</style>
