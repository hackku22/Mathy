<script setup lang="ts">
import {MathStatement} from '../support/parse'
import {onMounted, ref} from 'vue'
import {v4 as uuidv4} from 'uuid'
import {StatementID} from '../support/types'
import Katex from './Katex.vue'

const props = defineProps<{
  statement?: MathStatement,
}>()

const emit = defineEmits<{
  (eventName: 'save', statement: MathStatement): void,
}>()

const functionPreview = ref(MathStatement.temp(''))
let functionPreviewKey = ref(uuidv4())
const functionError = ref<string|undefined>(undefined)
const functionValue = ref('')

const updateFunctionPreview = () => {
  const previewStmt = MathStatement.temp(functionValue.value)
  if ( previewStmt.isValid() ) {
    functionPreview.value = MathStatement.temp(functionValue.value)
    functionPreviewKey.value = uuidv4()
  }
}

const validateFunction = () => {
  if ( !functionValue.value ) {
    return 'Missing function declaration'
  }

  const stmt = MathStatement.temp(functionValue.value)
  if ( !stmt.isValid() || !stmt.isFunctionDeclaration() ) {
    return 'Function definition is invalid'
  }

  if ( !stmt.isNotRecursive() ) {
    return 'A function may not reference itself'
  }
}

const saveFunction = () => {
  functionError.value = validateFunction()
  if ( functionError.value ) {
    return
  }

  if ( props.statement ) {
    props.statement.raw = functionValue.value
    emit('save', props.statement)
  } else {
    emit('save', new MathStatement(
        uuidv4() as StatementID,
        functionValue.value
    ))
  }
}

onMounted(() => {
  if ( props.statement ) {
    functionValue.value = props.statement.raw
    updateFunctionPreview()
  }
})
</script>

<template>
  <q-card>
    <q-card-section>
      <div  v-if="functionValue" style="display: flex; justify-content: center">
        <Katex
          :key="functionPreviewKey"
          :statement="functionPreview"
        />
      </div>
    </q-card-section>
    <q-card-section v-if="functionError">
      <div style="color: darkred; font-weight: bold">{{ functionError }}</div>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="functionValue"
        v-on:update:model-value="() => updateFunctionPreview()"
        outlined
        type="textarea"
        autogrow
        label="Value"
      />
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup></q-btn>
      <q-btn flat label="Save" @click="() => saveFunction()"></q-btn>
    </q-card-actions>
  </q-card>
</template>
