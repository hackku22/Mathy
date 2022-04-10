<script setup lang="ts">
import {onMounted, ref} from 'vue'
import router from '../router'

interface PageRecord {
  pageId: number|string,
  title: string,
}

const pages = ref<PageRecord[]>([])
const columns = ref([
  {
    name: 'title',
    field: 'title',
    label: 'Title',
  },
])

const loadPages = async () => {
  const response = await fetch(`/api/editor/pages`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  const result = (await response.json()) as unknown as any
  if ( !result.success ) {
    alert('Unable to load pages: ' + result?.message)
  }

  pages.value = result.data.records.map((row: any) => {
    return {
      pageId: row.pageId,
      title: JSON.parse(row.serialData).title || 'New Page',
    }
  })
}

onMounted(loadPages)

const onRowClick = (_: unknown, row: PageRecord) => {
  router.push({ path: `/Editor/${row.pageId}` })
}

const onNewPageClick = () => {
  router.push('/Editor')
}

</script>

<template>
  <div style="width: 100%">
    <q-btn icon="add" style="margin-bottom: 10px" @click="onNewPageClick">New Page</q-btn>
    <q-table
        style="width: 100%"
        title="My Pages"
        :columns="columns"
        :rows="pages"
        row-key="pageId"
        hide-bottom
        :pagination="{ rowsPerPage: 10000 }"
        @row-click="onRowClick"
    />
  </div>
</template>
