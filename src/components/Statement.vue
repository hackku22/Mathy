<script setup lang="ts">
import {EvaluationResult, Maybe} from '../support/types'
import {MathStatement} from '../support/parse'
import {computed} from 'vue'
import Katex from './Katex.vue'

const props = defineProps<{
  statement: MathStatement,
  evaluation?: EvaluationResult,
}>()

const getValueStatement = (): Maybe<MathStatement> => {
  const value = props.evaluation?.statements?.[props.statement.id]
  if ( value ) {
    return MathStatement.temp(String(value))
  }
}

let value = getValueStatement()
computed(() => value = getValueStatement())
</script>

<style>
  .math-statement {
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 10px;
    display: flex;
    flex-direction: row;
  }

  .content {
    flex: 1;
  }

  .sidebar {
    padding-left: 10px;
  }
</style>

<template>
  <div class="math-statement" style="background: white">
    <div class="content">
      <Katex :statement="statement" size="big"/>
      <div class="result" v-if="value">
        <hr v-if="value" style="border: 1px solid #ccc; border-bottom: 0">
        <Katex :statement="value" size="small" style="color: #666"/>
      </div>
    </div>
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
</template>
