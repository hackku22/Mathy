<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {MathPage} from '../support/page'
import {MathStatement} from '../support/parse'
import {EvaluationResult, hasOwnProperty} from '../support/types'
import Statement from '../components/Statement.vue'
import VarDeclEditor from './VarDeclEditor.vue'
import ExpressionEditor from './ExpressionEditor.vue'
import TextBox from '../components/TextBox.vue'
import {RichTextBox} from '../support/types'
import { stepX, stepY } from '../support/const'
import FunctionEditor from '../components/FunctionEditor.vue'

const math = new MathPage(uuidv4());
const statements = ref<MathStatement[]>([]);
const evaluation = ref<EvaluationResult | undefined>();
const statementsKey = ref<string>(uuidv4());
const leftDrawerOpen = ref(false);

const variableListingColumns = [
  {
    name: 'name',
    field: 'name',
    label: 'Variable',
    sortable: true,
  },
  {
    name: 'value',
    field: 'value',
    label: 'Value',
  },
]

const variableListingRows = ref<({name: string, value: string})[]>([])

const functionListingColumns = [
  {
    name: 'value',
    field: 'value',
    label: 'Function',
  },
]

const functionListingRows = ref<({name: string, value: string})[]>([])

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const newVariableModalOpen = ref(false)
const openNewVariableDeclModal = () => {
  newVariableModalOpen.value = true
};

const newExpressionModalOpen = ref(false)
const openNewExpressionModal = () => {
  newExpressionModalOpen.value = true
};

const newFunctionModalOpen = ref(false)
const openNewFunctionModal = () => {
  newFunctionModalOpen.value = true
}

const editingStatement = ref<MathStatement|undefined>()
const editExpressionModalOpen = ref(false)
const openEditExpressionModal = () => {
  editExpressionModalOpen.value = true
}

const editVarDeclModalOpen = ref(false)
const openEditVarDeclModal = () => {
  editVarDeclModalOpen.value = true
}

const editFunctionModalOpen = ref(false)
const openEditFunctionModal = () => {
  editFunctionModalOpen.value = true
}

const updateStatements = () => {
  statements.value = math.getStatements();
  try {
    evaluation.value = math.evaluate()
    const variableValues: ({name: string, value: string})[] = []

    for ( const name in evaluation.value!.variables ) {
      if ( !hasOwnProperty(evaluation.value!.variables, name) ) {
        continue
      }

      let value = String(evaluation.value!.variables[name] ?? '')
      try {
        const stmt = MathStatement.temp(value)
        value = stmt.toHTMLString()
      } catch (_) {}

      variableValues.push({
        name,
        value,
      })
    }

    variableListingRows.value = variableValues

    const functionValues: ({name: string, value: string})[] = []
    for ( const stmt of math.functions() ) {
      const node = stmt.parse() as math.FunctionAssignmentNode
      functionValues.push({
        name: node.name,
        value: stmt.toHTMLString(),
      })
    }

    functionListingRows.value = functionValues
  } catch (_) {
    console.error(_)
    evaluation.value = undefined
  }
  statementsKey.value = uuidv4()
};

onMounted(updateStatements)

const saveNewVariable = (stmt: MathStatement) => {
  math.addStatement(stmt)
  newVariableModalOpen.value = false
  updateStatements()
};

const saveNewExpression = (stmt: MathStatement) => {
  math.addStatement(stmt)
  newExpressionModalOpen.value = false
  updateStatements()
};

const saveNewFunction = (stmt: MathStatement) => {
  math.addStatement(stmt)
  newFunctionModalOpen.value = false
  updateStatements()
}

const editStatement = (stmt: MathStatement) => {
  editingStatement.value = stmt
  console.log('editStatement', stmt)
  if ( stmt.isFunctionDeclaration() ) {
    openEditFunctionModal()
  } else if ( stmt.isDeclaration() ) {
    openEditVarDeclModal()
  } else {
    openEditExpressionModal()
  }
}

const removeStatement = (stmt: MathStatement) => {
  math.removeStatement(stmt.id)
  updateStatements()
}

const finishEditStatement = () => {
  editExpressionModalOpen.value = false
  editVarDeclModalOpen.value = false
  editFunctionModalOpen.value = false
  updateStatements()
}

/*
  Rich Text Stuff
*/

const makeNewRichTextBox = () => {
  richTextStatements.value.push(new RichTextBox(""));
  richEditID.value = richTextStatements.value.length - 1;
  richEditExpression.value = richTextStatements.value[richEditID.value].text;
  richEditModal.value = true;
  console.log("editing statement",richEditID.value, richEditModal);
};

const richTextStatements = ref([]);

const richEditModal = ref(false);
const richEditExpression = ref("");
const richEditID = ref(0);

const richEditStatement = (id: number) => {
  console.log("editing statement", id, richEditModal);
  richEditModal.value = true;
  richEditID.value = id;
  richEditExpression.value = richTextStatements.value[richEditID.value].text;
};

function richUpdateValue() {
  richTextStatements.value[richEditID.value].text = richEditExpression.value;
}
const removeRichTextBox = (id: number) => {
  richTextStatements.value.splice(id, 1);
};
</script>

<template>
  <q-layout view="hHh Lpr fff">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs align="left">
        <q-route-tab to="/Scratch" label="Scratch" />
        <q-route-tab to="/Editor" label="Editor" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="column" style="height: 100%">
        <div class="col">
          <q-table
            flat
            title="Variables"
            :rows="variableListingRows"
            :columns="variableListingColumns"
            row-key="name"
            hide-no-data
            hide-bottom
            :pagination="{rowsPerPage: 10000}"
            style="height: 100%; border-radius: 0"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="value" :props="props">
                  <div v-html="props.row.value"></div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="col">
<!--          <q-separator />-->
          <q-table
            flat
            title="Functions"
            :rows="functionListingRows"
            :columns="functionListingColumns"
            row-key="name"
            hide-no-data
            hide-bottom
            hide-header
            :pagination="{rowsPerPage: 10000}"
            style="height: 100%; border-top: 1px solid lightgrey; border-radius: 0"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="value" :props="props">
                  <div v-html="props.row.value"></div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>

      <!-- drawer content -->
    </q-drawer>

    <q-page-container id="editor">
      <!--      <WrapperBox />-->

      <span v-for="statement in statements" style="display: flex">
        <Draggable
          :grid="[stepX, stepY]"
        >
          <div>
            <Statement
              :key="statementsKey"
              :statement="statement"
              :evaluation="evaluation"
              v-on:edit="() => editStatement(statement)"
              v-on:remove="() => removeStatement(statement)"
            />
          </div>
        </Draggable>
      </span>

      <q-dialog v-model="newVariableModalOpen">
        <VarDeclEditor v-on:save="(s) => saveNewVariable(s)" />
      </q-dialog>

      <q-dialog v-model="newExpressionModalOpen">
        <ExpressionEditor v-on:save="(s) => saveNewExpression(s)" />
      </q-dialog>

      <q-dialog v-model="editExpressionModalOpen">
        <ExpressionEditor
          :statement="editingStatement"
          v-on:save="() => finishEditStatement()"
        />
      </q-dialog>

      <q-dialog v-model="editVarDeclModalOpen">
        <VarDeclEditor
          :statement="editingStatement"
          v-on:save="() => finishEditStatement()"
        />
      </q-dialog>

      <q-dialog v-model="newFunctionModalOpen">
        <FunctionEditor
          v-on:save="(s) => saveNewFunction(s)"
        />
      </q-dialog>

      <q-dialog v-model="editFunctionModalOpen">
        <FunctionEditor
          :statement="editingStatement"
          v-on:save="() => finishEditStatement()"
        />
      </q-dialog>

      <q-page-sticky position="bottom-right" :offset="[32, 32]">
        <q-fab color="primary" icon="add" direction="left">
          <q-fab-action
            color="secondary"
            label="x"
            label-style="font-family: serif; font-size: 1.4rem; padding: 0"
            title="Add a variable declaration"
            @click="() => openNewVariableDeclModal()"
          />
          <q-fab-action
              color="secondary"
              icon="code"
              title="Add an expression"
              @click="() => openNewExpressionModal()"
          />
          <q-fab-action
              color="secondary"
              icon="functions"
              title="Add a new function"
              @click="() => openNewFunctionModal()"
          />
          <q-fab-action
            color="secondary"
            icon="text"
            title="Add a text box"
            @click="() => makeNewRichTextBox()"
          />
        </q-fab>
      </q-page-sticky>

      <q-dialog v-model="richEditModal">
        <q-card>
          <q-editor v-model="richEditExpression" min-height="5rem" />
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup></q-btn>
            <q-btn
              flat
              label="Save"
              @click="richUpdateValue"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div v-for="(item, index) in richTextStatements" style="display: flex">
        <TextBox
          :value="item"
          v-on:edit="() => (item.text ? richEditStatement(index) : {})"
          v-on:remove="() => removeRichTextBox(index)"
        />
      </div>
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Status</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style>
#editor {
  background-image: url(../assets/grid.svg);
  background-repeat: repeat;
  height: 100%;
}
</style>
