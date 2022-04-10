<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {MathPage} from '../support/page'
import {MathStatement} from '../support/parse'
import {ChartBox, EvaluationResult, hasOwnProperty} from '../support/types'
import Statement from '../components/Statement.vue'
import VarDeclEditor from './VarDeclEditor.vue'
import ExpressionEditor from './ExpressionEditor.vue'
import TextBox from '../components/TextBox.vue'
import FunctionEditor from '../components/FunctionEditor.vue'
import RangeChart from '../components/RangeChart.vue'
import RangeChartEditor from './RangeChartEditor.vue'
import { RichTextBox } from '../support/types'
import { stepX, stepY } from '../support/const'
import { checkLoggedIn, loggedOut } from '../support/auth'
import router from '../router'

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


const stmOnControlledDragStop = (stmt: MathStatement) => (e: { event: MouseEvent, data: { x: number, y: number } }) => {
  console.log(e)
  console.log("moved stm5", stmt)
  const { x, y } = e.data;
  stmt.x = x;
  stmt.y = y;
}


const variableListingRows = ref<({ name: string, value: string })[]>([])

const functionListingColumns = [
  {
    name: 'value',
    field: 'value',
    label: 'Function',
  },
]

const functionListingRows = ref<({ name: string, value: string })[]>([])

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

const editingStatement = ref<MathStatement | undefined>()
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
    const variableValues: ({ name: string, value: string })[] = []

    for (const name in evaluation.value!.variables) {
      if (!hasOwnProperty(evaluation.value!.variables, name)) {
        continue
      }

      let value = String(evaluation.value!.variables[name] ?? '')
      try {
        const stmt = MathStatement.temp(value)
        value = stmt.toHTMLString()
      } catch (_) { }

      variableValues.push({
        name,
        value,
      })
    }

    variableListingRows.value = variableValues

    const functionValues: ({ name: string, value: string })[] = []
    for (const stmt of math.functions()) {
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

onMounted(() => {
  updateStatements()
})

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
  if (stmt.isFunctionDeclaration()) {
    openEditFunctionModal()
  } else if (stmt.isDeclaration()) {
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
  richTextStatements.value.push(new RichTextBox(''));
  richEditID.value = richTextStatements.value.length - 1;
  richEditExpression.value = richTextStatements.value[richEditID.value].text;
  richEditModal.value = true;
};

const chartBoxKey = ref(uuidv4())
const chartBoxes = ref<ChartBox[]>([])

const newChartModalOpen = ref(false)
const openNewChartModal = () => {
  newChartModalOpen.value = true
}

const saveNewChartBox = (chartBox: ChartBox) => {
  chartBoxes.value.push(chartBox)
  newChartModalOpen.value = false
}

const editingChartBox = ref<ChartBox|undefined>()
const chartEditModalOpen = ref(false)
const openChartEditModal = (box: ChartBox) => {
  editingChartBox.value = box
  chartEditModalOpen.value = true
}

const saveEditingChartBox = () => {
  chartEditModalOpen.value = false
  chartBoxKey.value = uuidv4()
}

const moveChartBox = (id: number, x: number, y: number) => {
  chartBoxes.value[id].x = x
  chartBoxes.value[id].y = y
}
const removeChartBox = (id: number) => {
  chartBoxes.value.splice(id, 1);
};

const richTextStatements = ref<RichTextBox[]>([
  new RichTextBox("Hello World"),   
]);
const richEditModal = ref(false);
const richEditExpression = ref("");
const richEditID = ref(0);

const richEditStatement = (id: number) => {
  richEditModal.value = true;
  richEditID.value = id;
  richEditExpression.value = richTextStatements.value[richEditID.value].text;
};

const moveRichTextBox = (id: number, x: number, y: number) => {
  richEditID.value = id;
  richTextStatements.value[richEditID.value].x = x;
  richTextStatements.value[richEditID.value].y = y;
};



function richUpdateValue() {
  richTextStatements.value[richEditID.value].text = richEditExpression.value;
}
const removeRichTextBox = (id: number) => {
  console.log(richTextStatements.value[id]);
  richTextStatements.value.splice(id, 1);
};

/*
  Auth
*/
const status = ref(checkLoggedIn())
const logout = async () => {
  const response = await fetch('/api/logout/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  })
  loggedOut()
  status.value = checkLoggedIn()
  router.push('/')
}

onMounted(() => {
  status.value = checkLoggedIn()
  console.log(status.value)
  if (status.value == false) {
    router.push({ path: '/' })
  }
})

</script>

<template>
  <q-layout view="hHh Lpr fff">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar size="50px">
            <img src="../assets/l2.svg" />
          </q-avatar>
          <span style="font-family: 'Cinzel Decorative', cursive;">
            Crystal Math Worktable
          </span>
        </q-toolbar-title>         

        <span v-if="status" @click="logout()" label="Logout">Logout</span>

      </q-toolbar>

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
            :pagination="{ rowsPerPage: 10000 }"
            style="height: 100%; border-radius: 0"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">{{ props.row.name }}</q-td>
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
            :pagination="{ rowsPerPage: 10000 }"
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

    <q-page-container id="editor" style='padding=0'>
      <!--      <WrapperBox />-->

      <span v-for="(chartBox, index) in chartBoxes" style="display: flex">
        <RangeChart
          :fn="math.getFunctionByNameOrFail(chartBox.fnName)"
          :key="chartBoxKey"
          :value="chartBox"
          v-on:move="(x, y) => moveChartBox(index, x, y)"
          v-on:remove="() => removeChartBox(index)"
          v-on:edit="() => openChartEditModal(chartBox)"
        />
      </span>

      <span v-for="statement in statements" style="display: flex">
        <Draggable
          :grid="[stepX, stepY]"
          :position="{ x: statement.x, y: statement.y }"
          :default-position="{ x: statement.x, y: statement.y }"
          @stop="(e: { event: MouseEvent, data: { x: number, y: number } }) => stmOnControlledDragStop(statement)(e)"
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
        <ExpressionEditor :statement="editingStatement" v-on:save="() => finishEditStatement()" />
      </q-dialog>

      <q-dialog v-model="editVarDeclModalOpen">
        <VarDeclEditor :statement="editingStatement" v-on:save="() => finishEditStatement()" />
      </q-dialog>

      <q-dialog v-model="newFunctionModalOpen">
        <FunctionEditor v-on:save="(s) => saveNewFunction(s)" />
      </q-dialog>

      <q-dialog v-model="editFunctionModalOpen">
        <FunctionEditor :statement="editingStatement" v-on:save="() => finishEditStatement()" />
      </q-dialog>

      <q-dialog v-model="newChartModalOpen">
        <RangeChartEditor
          :page="math"
          v-on:save="c => saveNewChartBox(c)"
        />
      </q-dialog>

      <q-dialog v-model="chartEditModalOpen">
        <RangeChartEditor
          :page="math"
          :chartBox="editingChartBox"
          v-on:save="() => saveEditingChartBox()"
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
            icon="format_quote"
            title="Add a text box"
            @click="() => makeNewRichTextBox()"
          />
          <q-fab-action
            color="secondary"
            icon="show_chart"
            title="Add a new chart"
            @click="() => openNewChartModal()"
          />
        </q-fab>
      </q-page-sticky>

      <q-dialog v-model="richEditModal">
        <q-card>
          <q-editor v-model="richEditExpression" min-height="5rem" />
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup></q-btn>
            <q-btn flat label="Save" @click="richUpdateValue" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div v-for="(item, index) in richTextStatements" style="display: flex">
        <TextBox
          :value="item"
          v-on:edit="() => (item.text ? richEditStatement(index) : {})"
          v-on:remove="() => removeRichTextBox(index)"
          v-on:move="(x, y) => moveRichTextBox(index, x, y)"
        />
      </div>
    </q-page-container>


  </q-layout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap");



#editor {
  background-image: url(../assets/grid.svg);
  background-repeat: repeat;
  height: 100%;
    padding-top: 0px

}
</style>
