<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const editor = ref("");
const editMode = ref(false);

function edit() {
  editMode.value = !editMode.value;
}
</script>

<template>

  <q-dialog v-if="editMode" >
    <q-editor v-model="editor" min-height="5rem" />
  </q-dialog>


  <Draggable :grid="[25, 25]">
    <div style="display: flex">
      <q-card flat bordered>
        <q-card-section>
          <div class="row items-center no-wrap">
            <q-card-section v-html="editor" />
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section @click="edit">Edit</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Remove</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </Draggable>
</template>

<style lang="sass" scoped></style>
