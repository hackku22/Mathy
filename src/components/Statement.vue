<script setup lang="ts">
import {EvaluationResult, Maybe} from '../types'
import {MathStatement} from '../support/parse'
import {computed} from 'vue'
import Katex from './Katex.vue'

const props = defineProps<{
  statement: MathStatement,
  evaluation: EvaluationResult,
}>()

const getValueStatement = (): Maybe<MathStatement> => {
  const value = props.evaluation.statements[props.statement.id]
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
  <div class="math-statement">
    <div class="content">
      <Katex :statement="statement" size="big"/>
      <div class="result" v-if="value">
        <hr v-if="value" style="border: 1px solid #ccc; border-bottom: 0">
        <Katex :statement="value" size="small" style="color: #666"/>
      </div>
    </div>
    <div class="sidebar">
      <button>
        <img src="../assets/edit.svg" alt="Edit" height="16">
      </button>
    </div>
  </div>
</template>
