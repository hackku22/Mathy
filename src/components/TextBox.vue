<script setup lang="ts">
import { ref } from "vue";
import { RichTextBox } from "../support/types";
import { stepX, stepY } from "../support/const";
const props = defineProps<{value: RichTextBox}>();

const emit = defineEmits<{
  (eventName: 'move', x: number,y:number): void,
  (eventName: 'edit',): void,
  (eventName: 'remove',): void,

}>()


function onControlledDrag(e: {event: MouseEvent, data: {x: number, y: number}}) {
  
  // const x = e.x;
  // const y = e.y;
   const { x, y } = e.data;
   props.value.x = x;
   props.value.y = y;
   console.log(e)
}
function onControlledDragStop(e: {event: MouseEvent, data: {x: number, y: number}}) {
  // console.log(typeof(e))
    const { x, y } = e.data;
      // const x = e.x;
    // const y = e.y;
    console.log(self)
    emit('move', x, y);
  onControlledDrag(e);
}

</script>

<template>
  <Draggable
    :grid="[stepX, stepY]"
    :default-position="{ x: props.value.x, y: props.value.y }"
    :position="{ x: props.value.x, y: props.value.y }"
    @stop="onControlledDragStop"
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
                      <q-item-section @click="() => $emit('edit')">
                        <q-icon name="edit" />
                        <q-item-label>Edit</q-item-label>
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
