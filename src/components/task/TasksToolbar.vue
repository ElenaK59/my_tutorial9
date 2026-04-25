<script setup>
import { useTasksUiStore } from '@/stores/useTasksUiStore'
import ToolBar from '@/components/ui/ToolBar.vue'
import TaskFilters from '@/components/task/TaskFilters.vue'
import TaskSort from '@/components/task/TaskSort.vue'

const uiStore = useTasksUiStore()
const search = computed({
  get: () => uiStore.search.value,
  set: (v) => (uiStore.search.value = v),
})
const filter = computed({
  get: () => uiStore.filter.value,
  set: (v) => (uiStore.filter.value = v),
})
const sortMode = computed({
  get: () => uiStore.sortMode.value,
  set: (v) => (uiStore.sortMode.value = v),
})
</script>

<template>
  <div class="header">
    <ToolBar :search="search" @update:search="search = $event">
      <template #filters>
        <TaskFilters :modelValue="filter" @update:modelValue="filter = $event" />
      </template>

      <template #sort>
        <TaskSort :modelValue="sortMode" @update:modelValue="sortMode = $event" />
      </template>
    </ToolBar>
  </div>
</template>
