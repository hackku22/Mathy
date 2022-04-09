<script setup lang="ts">
  import {MathPage} from '../support/page'
  import {v4 as uuidv4} from 'uuid'
  import Statement from './Statement.vue'

  const page = new MathPage(uuidv4())
  const stmt1Id = page.addRaw('x = y+3/4')
  const stmt2Id = page.addRaw('y = 9')
  const evaluation = page.evaluate()
  console.log({page, stmt1Id})
</script>

<template>
  <p>Scratch page for testing!</p>
  <Statement :statement="page.getStatement(stmt1Id)" :evaluation="evaluation"/>
</template>
