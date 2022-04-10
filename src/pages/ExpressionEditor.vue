<script setup lang="ts">
import {defineEmits, onMounted, ref} from 'vue'
import {MathStatement} from '../support/parse'
import Katex from '../components/Katex.vue'
import { v4 as uuidv4 } from 'uuid'
import {StatementID} from '../types'

const props = defineProps<{
  statement?: MathStatement,
}>()

const emit = defineEmits<{
  (eventName: 'save', statement: MathStatement): void
}>()

const expressionPreview = ref(MathStatement.temp(''))
const expressionPreviewKey = ref(uuidv4())
const expressionError = ref<string|undefined>(undefined)
const expressionValue = ref<string>('')

const updateExpressionPreview = () => {
  const previewStmt = MathStatement.temp(expressionValue.value)
  if ( previewStmt.isValid() ) {
    expressionPreview.value = MathStatement.temp(expressionValue.value)
    expressionPreviewKey.value = uuidv4()
  }
}

const validateExpression = () => {
  const stmt = MathStatement.temp(expressionValue.value)
  if ( !stmt.isValid() ) {
    return 'The expression is invalid'
  }

  if ( stmt.defines().length > 0 ) {
    return 'Expressions cannot declare variables'
  }
}

const saveExpression = () => {
  expressionError.value = validateExpression()
  if ( expressionError.value ) {
    return
  }

  if ( props.statement ) {
    props.statement.raw = expressionValue.value
    emit('save', props.statement)
  } else {
    emit('save', new MathStatement(
        uuidv4() as StatementID,
        expressionValue.value
    ))
  }
}

onMounted(() => {
  if ( props.statement ) {
    expressionValue.value = props.statement.raw
    updateExpressionPreview()
  }
})
</script>

<template>
  <q-card>
    <q-card-section>
      <div style="display: flex; justify-content: center">
        <Katex
          :key="expressionPreviewKey"
          :statement="expressionPreview"
        />
      </div>
    </q-card-section>
    <q-card-section v-if="expressionError">
      <div style="color: darkred; font-weight: bold">{{ expressionError }}</div>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="expressionValue"
        v-on:update:model-value="() => updateExpressionPreview()"
        outlined
        autogrow
        type="textarea"
        autofocus
        label="Expression"
      />
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup></q-btn>
      <q-btn flat label="Save" @click="() => saveExpression()"></q-btn>
    </q-card-actions>
  </q-card>
</template>
