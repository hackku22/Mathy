<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const count = ref(0);
function increment() {
  count.value++
}

</script>

<template>
  <Draggable :grid="[25, 25]">
    <div>
      <div>Grid with component</div>

        <q-btn @click="increment">Count is: {{ count }}</q-btn>
        <q-card class="my-card">
            hi
        </q-card>
    </div>
  </Draggable>
</template>
<style lang="sass" scoped>
.my-card
  width: 50%
  max-width: 250px
</style>