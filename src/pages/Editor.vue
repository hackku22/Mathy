<script setup lang="ts">
import { ref } from "vue";
import WrapperBox from "../components/WrapperBox.vue";
import TextBox from "../components/TextBox.vue";

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

/*
  Rich Text Stuff
*/

const richTextStatments = ref([
  { text: "test" },
  { text: "test2" },
  { text: "test3" },
]);

const richEditModal = ref(false);
const richEditExpression = ref("");
const richEditID = ref(0);

const richEditStatement = (id: int) => {
  console.log("editing statement", id, richEditModal);
  richEditModal.value = true;
  richEditID.value = id;
  richEditExpression.value = richTextStatments.value[richEditID.value].text;
};

function richUpdateValue() {
  richTextStatments.value[richEditID.value].text = richEditExpression.value;
}
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
        <div class="col">variables</div>
        <div class="col">
          <q-separator />
          function
        </div>
      </div>

      <!-- drawer content -->
    </q-drawer>

    <q-page-container id="editor" style="display: flex">
      <q-dialog v-model="richEditModal">
        <q-card>
          <q-editor v-model="richEditExpression" min-height="5rem" />
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup></q-btn>
            <q-btn flat label="Save" @click="richUpdateValue" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <span v-for="(item, index) in richTextStatments">
        <TextBox
          :statement="item.text"
          v-on:edit="() => (item.text ? richEditStatement(index) : {})"
        ></TextBox>
      </span>
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
