<script setup lang="ts">
  import {MathPage} from '../support/page'
  import {v4 as uuidv4} from 'uuid'
  import Statement from './Statement.vue'
  import {MathStatement} from '../support/parse'

  const page = new MathPage(uuidv4())
  const stmt1Id = page.addRaw('x = y+3/4')
  const stmt2Id = page.addRaw('y = 9')
  const evaluation = page.evaluate()

  const stmt = page.getStatement(stmt1Id)
  console.log({page, stmt1Id})

  const onEdit = (stmt: MathStatement) => () => console.log('edit', stmt)
</script>

<template>
  <p>Scratch page for testing!</p>
  <Statement v-if="stmt" :statement="stmt" :evaluation="evaluation"/>
</template>
