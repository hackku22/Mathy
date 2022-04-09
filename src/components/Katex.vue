<script setup lang="ts">
import {computed} from 'vue'
import {MathStatement} from '../support/parse'

const props = defineProps<{
  statement: MathStatement,
  size?: 'big' | 'small',
}>()

const getRenderedHTML = () => {
  console.log('getRenderedHTML', props.statement)
  try {
    return props.statement.toHTMLString()
  } catch (_) {
    return ''
  }
}

let renderedHtml = getRenderedHTML()
computed(() => renderedHtml = getRenderedHTML())
</script>

<style>
  .big {
    font-size: 1.3em;
  }

  .small {
    font-size: 0.9em;
  }
</style>

<template>
  <div ref="container" class="big" v-if="props?.size === 'big'" v-html="renderedHtml"></div>
  <div ref="container" class="small" v-else-if="props?.size === 'small'" v-html="renderedHtml"></div>
  <div ref="container" v-else v-html="renderedHtml"></div>
</template>
