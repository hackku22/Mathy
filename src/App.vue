<script setup lang="ts">
import Home from "./pages/Login.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "./components/HelloWorld.vue";
import { MathStatement } from "./support/parse";
import { MathPage } from "./support/page";
import { ref } from "vue";

(window as any).Stmt = MathStatement;
(window as any).Pg = MathPage;
</script>

<template>
  <q-layout view="hHr LpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
            

          <q-avatar>
            <img src="./assets/logo.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/Scratch" label="Scratch" />
        <q-route-tab to="/Editor" label="Editor" />

      </q-tabs>
    </q-header>

    <q-page-container style="display: flex;padding-top: 20px;">
      <router-view />
    </q-page-container>
  </q-layout>
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
