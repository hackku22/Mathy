<script setup lang="ts">
import {computed} from 'vue'
import {MathStatement} from '../support/parse'

const props = defineProps<{
  statement: MathStatement,
  size?: 'big' | 'small',
}>()

const getRenderedHTML = () => props.statement.toHTMLString()

const renderedHtml = getRenderedHTML()
computed(getRenderedHTML)
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
  <div ref="container" class="big" v-if="props?.size === 'big'" v-html="renderedHtml"></div>
  <div ref="container" class="small" v-else-if="props?.size === 'small'" v-html="renderedHtml"></div>
  <div ref="container" v-else v-html="renderedHtml"></div>
</template>
