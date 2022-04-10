<script setup lang="ts">
import {ref} from 'vue'
import {MathStatement} from '../support/parse'
import {v4 as uuidv4} from 'uuid'
import Katex from '../components/Katex.vue'
import {StatementID} from '../support/types'

const emit = defineEmits<{
  (eventName: 'save', statement: MathStatement): void,
}>()

const newVariablePreview = ref(MathStatement.temp('? = ?'))
let newVariablePreviewKey = ref(uuidv4())
const newVariableModalError = ref<string|undefined>(undefined)
const newVariableName = ref('')
const newVariableValue = ref('')

const updateNewVariablePreview = () => {
  const previewStmt = MathStatement.temp(`${newVariableName.value} = ${newVariableValue.value}`)
  if ( previewStmt.isValid() ) {
    newVariablePreview.value = MathStatement.temp(`${newVariableName.value} = ${newVariableValue.value}`)
    newVariablePreviewKey.value = uuidv4()
  }
}

const validateNewVariable = () => {
  if ( !newVariableName.value ) {
    return 'Missing variable name'
  }

  if ( !newVariableValue.value ) {
    return 'Missing variable value'
  }

  const stmt = MathStatement.temp(`${newVariableName.value} = ${newVariableValue.value}`)
  if ( !stmt.isValid() ) {
    return 'Assignment is invalid'
  }

  if ( !stmt.isNotRecursive() ) {
    return 'A variable may not reference itself'
  }
}

const saveNewVariable = () => {
  newVariableModalError.value = validateNewVariable()
  if ( newVariableModalError.value ) {
    return
  }

  emit('save', new MathStatement(
      uuidv4() as StatementID,
      `${newVariableName.value} = ${newVariableValue.value}`
  ))
}
</script>

<template>
  <q-card>
    <q-card-section>
      <div style="display: flex; justify-content: center">
        <Katex
          :key="newVariablePreviewKey"
          :statement="newVariablePreview"
        />
      </div>
    </q-card-section>
    <q-card-section v-if="newVariableModalError">
      <div style="color: darkred; font-weight: bold">{{ newVariableModalError }}</div>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="newVariableName"
        v-on:update:model-value="() => updateNewVariablePreview()"
        outlined
        autofocus
        label="Variable name"
      />
      <br>
      <q-input
        v-model="newVariableValue"
        v-on:update:model-value="() => updateNewVariablePreview()"
        outlined
        type="textarea"
        autogrow
        label="Value"
      />
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup></q-btn>
      <q-btn flat label="Save" @click="() => saveNewVariable()"></q-btn>
    </q-card-actions>
  </q-card>
</template>
