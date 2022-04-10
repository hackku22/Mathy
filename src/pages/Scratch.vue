<script setup lang="ts">
import { MathPage } from '../support/page'
import { v4 as uuidv4 } from 'uuid'
import Statement from '../components/Statement.vue'
import { MathStatement } from '../support/parse'
import { onMounted, ref } from 'vue'
import Katex from '../components/Katex.vue'
import { checkLoggedIn, loggedOut } from '../support/auth'
import router from '../router'

const page = new MathPage(uuidv4())
const stmt1Id = page.addRaw('x = y+3/4')
const stmt2Id = page.addRaw('y = 9')
const evaluation = page.evaluate()

const stmt = page.getStatement(stmt1Id)
console.log({ page, stmt1Id })

let editModal = ref(false)
let editExpression = ref('')
let editPreview = ref(MathStatement.temp(''))
let activeStatement!: MathStatement

const editStatement = (stmt: MathStatement) => {
  console.log('editing statement', stmt, editModal)
  activeStatement = stmt
  editPreview.value = MathStatement.temp(stmt.raw)
  editModal.value = true
  editExpression.value = stmt.raw
}

let key = ref(uuidv4())
const updateEditRender = () => {
  const previewStmt = MathStatement.temp(editExpression.value)
  if (previewStmt.isValid()) {
    editPreview.value = MathStatement.temp(editExpression.value)
    key.value = uuidv4()
  }
}

</script>

<template>
  <p>Scratch page for testing!</p>
  <q-dialog ref="edit-modal" v-model="editModal">
    <q-card>
      <q-card-section>
        <div style="display: flex; justify-content: center">
          <Katex :statement="editPreview" :key="key" />
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="editExpression"
          v-on:update:model-value="() => updateEditRender()"
          type="textarea"
          outlined
          label="Expression"
          autogrow
          autofocus
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup></q-btn>
        <q-btn flat label="Save" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <Statement
    v-if="stmt"
    v-on:edit="() => stmt ? editStatement(stmt) : {}"
    :statement="stmt"
    :evaluation="evaluation"
  />
</template>
