<script setup lang="ts">
import * as math from 'mathjs'
import {onMounted, ref} from 'vue'
import {MathStatement} from '../support/parse'
import {v4 as uuidv4} from 'uuid'
import Katex from '../components/Katex.vue'
import {ChartBox, StatementID} from '../support/types'
import {MathPage} from '../support/page'

const props = defineProps<{
  page: MathPage,
  chartBox?: ChartBox,
}>()

const emit = defineEmits<{
  (eventName: 'save', statement: ChartBox): void,
}>()

const chartBoxModalError = ref<string|undefined>(undefined)
const chartBoxFunctionName = ref('')
const chartBoxMinXValue = ref(0)
const chartBoxMaxXValue = ref(30)
const chartBoxStepXValue = ref(1)

const validateChartBox = () => {
  if ( !chartBoxFunctionName.value ) {
    return 'Missing function name'
  }

  if ( isNaN(parseFloat(String(chartBoxMinXValue.value))) ) {
    return 'Invalid minimum X-value'
  }

  if ( isNaN(parseFloat(String(chartBoxMaxXValue.value))) ) {
    return 'Invalid maximum X-value'
  }

  if ( isNaN(parseFloat(String(chartBoxStepXValue.value))) ) {
    return 'Invalid X-value step size'
  }

  if ( !props.page.getFunctionByName(chartBoxFunctionName.value) ) {
    return 'Invalid function name'
  }
}

const saveChartBox = () => {
  chartBoxModalError.value = validateChartBox()
  if ( chartBoxModalError.value ) {
    return
  }

  if ( props.chartBox ) {
    props.chartBox.fnName = chartBoxFunctionName.value
    props.chartBox.minX = chartBoxMinXValue.value
    props.chartBox.maxX = chartBoxMaxXValue.value
    props.chartBox.stepX = chartBoxStepXValue.value
    emit('save', props.chartBox)
  } else {
    emit('save', new ChartBox(
        chartBoxFunctionName.value,
        chartBoxMinXValue.value,
        chartBoxMaxXValue.value,
        chartBoxStepXValue.value,
    ))
  }
}

onMounted(() => {
  if ( props.chartBox ) {
    chartBoxFunctionName.value = props.chartBox.fnName
    chartBoxMinXValue.value = props.chartBox.minX
    chartBoxMaxXValue.value = props.chartBox.maxX
    chartBoxStepXValue.value = props.chartBox.stepX
  }
})
</script>

<template>
  <q-card>
    <q-card-section v-if="chartBoxModalError">
      <div style="color: darkred; font-weight: bold">{{ chartBoxModalError }}</div>
    </q-card-section>
    <q-card-section>
      <q-input
          v-model="chartBoxFunctionName"
          outlined
          autofocus
          label="Function name"
      />
      <br>
      <q-input
          v-model="chartBoxMinXValue"
          outlined
          autofocus
          label="Minimum X-value"
      />
      <br>
      <q-input
          v-model="chartBoxMaxXValue"
          outlined
          autofocus
          label="Maximum X-value"
      />
      <br>
      <q-input
          v-model="chartBoxStepXValue"
          outlined
          autofocus
          label="X-value step size"
      />
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup></q-btn>
      <q-btn flat label="Save" @click="() => saveChartBox()"></q-btn>
    </q-card-actions>
  </q-card>
</template>
