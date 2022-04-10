<script setup lang="ts">
import { ref } from "vue";
import { RichTextBox } from "../support/types";
import { stepX, stepY } from "../support/const";
const props = defineProps<{value: RichTextBox}>();

</script>

<template>
  <Draggable
    :grid="[stepX, stepY]"
    :default-position="{ x: props.value.x, y: props.value.y }"
  >
    <div>
      <q-card flat bordered>
        <q-card-section style="padding: 0">
          <div class="row items-center no-wrap">
            <q-card-section v-html="props.value.text" />
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section @click="() => $emit('edit')"
                        >Edit</q-item-section
                      >
                    </q-item>
                    <q-item clickable>
                      <q-item-section @click="() => $emit('remove')"
                        >Remove</q-item-section
                      >
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
