<script setup>
import { computed } from 'vue'
import { useTasksStore } from '@/stores/useTasksStore'
import TaskList from '@/components/task/TaskList.vue'

const tasksStore = useTasksStore()
const tasks = computed(() => {
  const firstColumn = tasksStore.columns[0]
  if (!firstColumn) return []

  return tasksStore.tasksByStatus(firstColumn.id)
})
</script>

<template>
  <div>
    <TaskList :tasks="tasks" />
  </div>
</template>
