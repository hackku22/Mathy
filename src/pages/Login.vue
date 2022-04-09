<script setup lang="ts">
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';

defineProps<{ msg: string }>()

const { loginWithRedirect } = useAuth0();

const login = () => {
    loginWithRedirect();
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <button @click="login">Log in</button>
  
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
</style>
