<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  statement: { type: String, required: true },
  })
</script>

<template>
  <Draggable :grid="[25, 25]">
    <div style="display: flex">
      <q-card flat bordered>
        <q-card-section>
          <div class="row items-center no-wrap">
            <q-card-section v-html="props.statement" />
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section @click="() => $emit('edit')">Edit</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section @click="() => $emit('remove')">Remove</q-item-section>
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
