<script setup lang="ts">
import { ref } from 'vue'
import Login from '../components/Login.vue'

defineProps<{ msg: string }>()

const show = ref<boolean>(true)
</script>

<template>
  <q-layout>
    <h1>{{ msg }}</h1>
    <transition
      appear
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <q-btn color="primary" text-color="white" @click="show = !show" v-if="show">Start</q-btn>
      <div class="login" v-else>
        <q-card square bordered class="q-pa-lg shadow-1">
          <Login />
        </q-card>
      </div>
    </transition>
  </q-layout>
</template>

<style scoped>
button {
  background-color: #4484c4;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 32px;
  border-radius: 5px;
}

.login {
  max-width: 30em;
  margin: auto;
}
</style>
