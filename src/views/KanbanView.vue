<script setup>
import { ref } from 'vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import TasksToolbar from '@/components/task/TasksToolbar.vue'
import { useTasksStore } from '@/stores/useTasksStore'
import HistoryControls from '@/views/HistoryControls.vue'
const tasksStore = useTasksStore()
const newColumnName = ref('')
function createColumn() {
  if (!newColumnName.value.trim()) return

  tasksStore.addColumn(newColumnName.value)
  newColumnName.value = ''
}
</script>

<template>
  <div class="kanban">
    <TasksToolbar />
    <KanbanBoard />
    <input
      class="new-column-input"
      v-model="newColumnName"
      placeholder="Новая колонка..."
      @keyup.enter="createColumn"
    />
    <HistoryControls />
  </div>
</template>
<style scoped>
.kanban {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #e0e9ee;
  padding: 20px 25px;
  border-radius: 8px;
  width: 100%;
  min-height: 600px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
.new-column-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #48c172;
}
</style>
