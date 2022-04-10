<script setup lang="ts">
import { onMounted, ref } from 'vue'
import validator from 'validator'
import { checkLoggedIn, loggedIn } from '../support/auth'
import router from '../router'
const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const btnDisabled = ref<boolean>(true)
const isRegistration = ref<boolean>(false)
const error = ref<string>('')

const checkForm = () => {
    btnDisabled.value =
        (isRegistration.value
            && (password.value != passwordConfirm.value
                || name.value.length == 0))
        || password.value.length < 8
        || email.value.length == 0
        || !validator.isEmail(email.value);
}

const submit = async () => {
    if (isRegistration.value == true) {
        error.value = await register()
    } else {
        error.value = await login()
    }
}

const login = async () => {
    const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.value, password: password.value })
    })

    const user = (await response.json()) as unknown as any
    if (!user.success) {
        return user.message
    }
    loggedIn()
    router.push({ path: '/Listings'})
}

const register = async () => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name:name.value, email:email.value, password:password.value })
    })
    const user = (await response.json()) as unknown as any
    if (!user.success) {
        return user.message
    }
    loggedIn()
    router.push({ path: '/Listings'})
}

onMounted(() => {
    if ( checkLoggedIn() ) {
        router.push({ path: '/Listings'})
    }
})

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
            <q-input
                v-model="passwordConfirm"
                v-on:keyup="checkForm()"
                type="password"
                label="password confirmation"
            />
        </q-form>
    </q-card-section>
    <q-card-section v-if="error">
        <p class="error">
            <b>{{ error }}</b>
        </p>
    </q-card-section>
    <q-card-actions class="q-px-md">
        <q-btn
            unelevated
            color="primary"
            size="lg"
            :disable="btnDisabled"
            class="full-width"
            :label="isRegistration ? 'Register' : 'Login'"
            @click="submit()"
        />
    </q-card-actions>
    <q-card-section class="text-center q-pa-none">
        <p class="text-grey-6">
            {{ isRegistration ? 'Have an account?' : 'Not registered?' }}
            <a
                href="#"
                @click="isRegistration = !isRegistration; checkForm()"
            >{{ isRegistration ? 'Login' : 'Create an Account' }}</a>
        </p>
    </q-card-section>
</template>
<style>
.error {
    color: red;
}
</style>

