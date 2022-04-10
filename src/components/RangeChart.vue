<script setup lang="ts">
import * as math from 'mathjs'
import { v4 as uuidv4 } from 'uuid'
import { LineChart } from 'vue-chart-3'
import { computed, ref } from 'vue'
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js'
import { MathStatement } from '../support/parse'
import { ChartBox } from '../support/types'
import { stepX, stepY } from '../support/const'

Chart.register(...registerables)

const emit = defineEmits<{
  (eventName: 'move', x: number, y: number): void,
  (eventName: 'edit'): void,
  (eventName: 'remove'): void,
}>()

const props = defineProps<{
  fn: MathStatement,
  value: ChartBox,
}>()
const options = ref({
  plugins: {
    legend: {
      labels: {
        color: "white",
        font: {
          size: 18
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        color: "white",
        font: {
          size: 15,
        },
      },
      grid: {
          color: '#ccc'
      }
    },
    x: {
      ticks: {
        color: "white",
        font: {
          size: 14
        },
      },
      grid: {
          color: '#ccc'
      }
    }
  }
})

const getChartData = (): ChartData<'line'> => {
  const range = []
  const min = Math.min(props.value.minX, props.value.maxX)
  const max = Math.max(props.value.minX, props.value.maxX)
  for (let i = min; i <= max; i += parseFloat(String(props.value.stepX)) || 1) {
    range.push(i)
  }

  if (!props.fn.isFunctionDeclaration()) {
    throw new TypeError('Cannot chart node that is not a function.')
  }

  const node = props.fn.parse() as math.FunctionAssignmentNode
  const fn = node.compile().evaluate()  // FIXME need dependencies in scope

  console.log('getChartData', {
    labels: range.map(x => `${x}`),
    datasets: [
      {
        label: node.name,
        data: range.map(n => fn(n)),
      },
    ],
  })
  return {
    labels: range.map(x => `${x}`),
    datasets: [{
      label: node.name,
      backgroundColor: '#553564',
      borderColor: '#ccc',
      data: range.map(x => fn(x)),
      pointRadius: 5
    }],
  }
}

const chartData = ref(getChartData())
const chartKey = ref(uuidv4())
computed(() => {
  chartData.value = getChartData()
  chartKey.value = uuidv4()
})

function onControlledDrag(e: { event: MouseEvent, data: { x: number, y: number } }) {

  // const x = e.x;
  // const y = e.y;
  const { x, y } = e.data;
  props.value.x = x;
  props.value.y = y;
  console.log(e)
}
function onControlledDragStop(e: { event: MouseEvent, data: { x: number, y: number } }) {
  // console.log(typeof(e))
  const { x, y } = e.data;
  // const x = e.x;
  // const y = e.y;
  console.log(self)
  emit('move', x, y);
  onControlledDrag(e);
}
</script>
<template>
  <Draggable
    :grid="[stepX, stepY]"
    :default-position="{ x: props.value.x, y: props.value.y }"
    :position="{ x: props.value.x, y: props.value.y }"
    @stop="onControlledDragStop"
  >
    <div
      style="background: var(--q-dark); display: flex; flex-direction: row; border: 1px solid #ccc; border-radius: 3px;"
    >
      <LineChart :options="options" :chartData="chartData" :key="chartKey" class="inner-chart" />
      <div class="sidebar">
        <q-btn color="grey-7" round flat icon="more_vert">
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable>
                <q-item-section @click="() => $emit('edit')">Edit</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section @click="() => $emit('remove')">Remove</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </Draggable>
</template>

<style>
</style>

