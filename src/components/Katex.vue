<script setup lang="ts">
import {HTMLString} from '../types'
import {computed} from 'vue'
import {MathStatement} from '../support/parse'

const props = defineProps<{
  statement: MathStatement,
  size?: 'big' | 'small',
}>()

let displayHtml: HTMLString = props.statement.toHTMLString()
computed(() => displayHtml = props.statement.toHTMLString())
</script>

<style>
  .big {
    transform: scale(1.3);
  }

  .small {
    transform: scale(0.9);
  }
</style>

<template>
  <div class="big" v-if="props?.size === 'big'" v-html="displayHtml"></div>
  <div class="small" v-else-if="props?.size === 'small'" v-html="displayHtml"></div>
  <div v-else v-html="displayHtml"></div>
</template>
