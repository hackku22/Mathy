<script setup lang="ts">
import { ref } from 'vue'
import validator from 'validator'
const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const btnDisabled = ref<boolean>(true)
const isRegistration =ref<boolean>(false)

const checkForm = () => {
    btnDisabled.value = 
    (isRegistration.value 
    && (password.value != passwordConfirm.value
    || name.value.length == 0))
    || password.value.length < 8
    || email.value.length == 0
    || !validator.isEmail(email.value);
}
</script>

<template>
    
        <q-card-section v-if="!isRegistration">
            <q-form class="q-gutter-md">
                <q-input v-model="email" v-on:keyup="checkForm()" type="email" label="email" />
                <q-input v-model="password" v-on:keyup="checkForm()" type="password" label="password" />
            </q-form>
        </q-card-section>
        <q-card-section v-else>
            <q-form class="q-gutter-md">
                <q-input v-model="name" v-on:keyup="checkForm()" type="text" label="name" />
                <q-input v-model="email" v-on:keyup="checkForm()" type="email" label="email" />
                <q-input v-model="password" v-on:keyup="checkForm()" type="password" label="password" />
                <q-input v-model="passwordConfirm" v-on:keyup="checkForm()" type="password" label="password confirmation" />

            </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="lg" :disable=btnDisabled class="full-width" :label="isRegistration? 'Register' : 'Login'" />
        </q-card-actions>
        <q-card-section class="text-center q-pa-none">
            
            <p class="text-grey-6">{{isRegistration? 'Have an account?' :'Not reigistered?'}} <a href="#" @click="isRegistration = !isRegistration; checkForm()">{{isRegistration? 'Login':'Created an Account'}}</a></p>
        </q-card-section>
</template>

