<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { MathPage } from '../support/page'
import { MathStatement } from '../support/parse'
import { ChartBox, EvaluationResult, hasOwnProperty } from '../support/types'
import Statement from '../components/Statement.vue'
import VarDeclEditor from '../components/VarDeclEditor.vue'
import ExpressionEditor from '../components/ExpressionEditor.vue'
import TextBox from '../components/TextBox.vue'
import ImageBox from '../components/ImageBox.vue'

import FunctionEditor from '../components/FunctionEditor.vue'
import { RichTextBox, ImageContainer } from '../support/types'
import RangeChart from '../components/RangeChart.vue'
import RangeChartEditor from '../components/RangeChartEditor.vue'
import { stepX, stepY } from '../support/const'
import { checkLoggedIn, loggedOut } from '../support/auth'
import router from '../router'

const props = defineProps<{
  pageId?: number,
}>()

const math = ref(new MathPage(uuidv4()));
const pageTitle = ref('New Page');
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

const chartBoxKey = ref(uuidv4())
const updateStatements = () => {
  statements.value = math.value.getStatements();
  try {
    evaluation.value = math.value.evaluate()
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
    for (const stmt of math.value.functions()) {
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
  math.value.addStatement(stmt)
  newVariableModalOpen.value = false
  updateStatements()
  chartBoxKey.value = uuidv4()
};

const saveNewExpression = (stmt: MathStatement) => {
  math.value.addStatement(stmt)
  newExpressionModalOpen.value = false
  updateStatements()
  chartBoxKey.value = uuidv4()
};

const saveNewFunction = (stmt: MathStatement) => {
  math.value.addStatement(stmt)
  newFunctionModalOpen.value = false
  updateStatements()
  chartBoxKey.value = uuidv4()
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
  math.value.removeStatement(stmt.id)
  updateStatements()
  chartBoxKey.value = uuidv4()
}

const finishEditStatement = () => {
  editExpressionModalOpen.value = false
  editVarDeclModalOpen.value = false
  editFunctionModalOpen.value = false
  updateStatements()
  chartBoxKey.value = uuidv4()
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

const chartBoxes = ref<ChartBox[]>([])

const newChartModalOpen = ref(false)
const openNewChartModal = () => {
  newChartModalOpen.value = true
}

const saveNewChartBox = (chartBox: ChartBox) => {
  chartBoxes.value.push(chartBox)
  newChartModalOpen.value = false
  chartBoxKey.value = uuidv4()
}

const editingChartBox = ref<ChartBox | undefined>()
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
  Image box
*/

const makeNewImageBox = () => {
  images.value.push(new ImageContainer(''));
  imageID.value = images.value.length - 1;
  imageURL.value = images.value[imageID.value].url;
  imageModal.value = true;
};

const images = ref<ImageContainer[]>([]);

const imageModal = ref(false);
const imageURL = ref("");
const imageID = ref(0);

const imageEditStatement = (id: number) => {
  imageModal.value = true;
  imageID.value = id;
  imageURL.value = images.value[imageID.value].url;
};

const moveImageBox = (id: number, x: number, y: number) => {
  imageID.value = id;
  images.value[imageID.value].x = x;
  images.value[imageID.value].y = y;
};



function imageUpdateValue() {
  images.value[imageID.value].url = imageURL.value;
}
const removeimageBox = (id: number) => {
  console.log(images.value[id]);
  images.value.splice(id, 1);
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

const serialize = () => {
  return {
    title: pageTitle.value,
    page: math.value.serialize(),
    textBoxes: richTextStatements.value.map(x => x.serialize()),
    chartBoxes: chartBoxes.value.map(x => x.serialize()),
    imageBoxes: images.value.map(x => x.serialize()),
  }
}

const editorPageId = ref<number|undefined>()
const saveEditorPage = async (close = false) => {
  const params = {
    serialData: JSON.stringify(serialize()),
  } as any

  if ( editorPageId.value ) {
    params.pageId = editorPageId.value
  }

  const response = await fetch('/api/editor/page', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  })

  const result = (await response.json()) as unknown as any
  if (!result.success) {
    return alert('Failed to save page: ' + result.message)
  }

  const justCreated = !editorPageId.value
  editorPageId.value = result.data.pageId
  if ( close ) {
    await router.push('/Listings')
  } else if ( justCreated ) {
    await router.push(`/Editor/${editorPageId.value}`)
  }
}

const deleteEditorPage = async (close = false) => {
  const params = {
    serialData: JSON.stringify(serialize()),
  } as any

  if ( editorPageId.value ) {
    params.pageId = editorPageId.value
  }

  const response = await fetch('/api/editor/page', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  })
  await router.push('/Listings')
}

const loadEditorPage = async () => {
  if ( !editorPageId.value ) {
    return
  }

  const pageId = editorPageId.value
  const response = await fetch(`/api/editor/page?pageId=${pageId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  const result = (await response.json()) as unknown as any
  if (!result.success) {
    return alert('Failed to load page: ' + result.message)
  }

  const serialData = result.data.serialData
  const serialized = JSON.parse(serialData) as any
  math.value = MathPage.deserialize(serialized.page)
  richTextStatements.value = serialized.textBoxes.map((box: any) => RichTextBox.deserialize(box))
  chartBoxes.value = serialized.chartBoxes.map((box: any) => ChartBox.deserialize(box))
  images.value = serialized.imageBoxes.map((box: any) => ImageContainer.deserialize(box))
  pageTitle.value = serialized.title ?? 'New Page'
  updateStatements()
  chartBoxKey.value = uuidv4()
}

onMounted(() => {
  if ( props.pageId ) {
    editorPageId.value = props.pageId
    loadEditorPage()
    return
  }

  const paramPageId = router.currentRoute.value.params.pageId
  if ( !Array.isArray(paramPageId) && !isNaN(parseInt(paramPageId, 10)) ) {
    editorPageId.value = parseInt(paramPageId, 10)
    loadEditorPage()
    return
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

        <q-btn v-if="status" @click="logout()" label="Logout"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="column" style="height: 100%">
        <div>
          <q-input
            v-model="pageTitle"
            label="Title"
            style="padding: 10px"
          ></q-input>
        </div>
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

    <q-page-container id="editor" style='padding: 0'>
      <span v-for="(chartBox, index) in chartBoxes" style="display: flex">
        <RangeChart
          :page="math"
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
        <!-- // @ts-ignore -->
        <RangeChartEditor :page="math" v-on:save="c => saveNewChartBox(c)" />
      </q-dialog>

      <q-dialog v-model="chartEditModalOpen">
        <RangeChartEditor
          :page="math"
          :chartBox="editingChartBox"
          v-on:save="() => saveEditingChartBox()"
        />
      </q-dialog>

      <q-page-sticky position="top-right" :offset="[18, 18]">
        <q-btn fab icon="save" title="Save" color="primary" @click="() => saveEditorPage()"/>
      </q-page-sticky>

      <q-page-sticky position="top-right" :offset="[18, 90]">
        <q-btn fab icon="close" title="Save and close" color="primary" @click="() => saveEditorPage(true)"/>
      </q-page-sticky>
      <q-page-sticky position="top-right" :offset="[18, 162]">
        <q-btn fab icon="delete_forever" title="Delete forever" color="primary" @click="() => deleteEditorPage()"/>
      </q-page-sticky>

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
            icon="image"
            title="Add an image box"
            @click="() => makeNewImageBox()"
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

      <q-dialog v-model="imageModal">
        <q-card autogrow style="min-width: 25em;">
          <q-input autogrow v-model="imageURL" />
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup></q-btn>
            <q-btn flat label="Save" @click="imageUpdateValue" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div v-for="(item, index) in images" style="display: flex">
        <ImageBox
          :value="item"
          v-on:edit="() => (item.url ? imageEditStatement(index) : {})"
          v-on:remove="() => removeimageBox(index)"
          v-on:move="(x, y) => moveImageBox(index, x, y)"
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
  padding-top: 0px;
}
</style>
