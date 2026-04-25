<script setup>
import { useTasksStore } from '@/stores/useTasksStore'
import TodoView from './views/TodoView.vue'
import KanbanView from './views/KanbanView.vue'
import { useUndoRedoShortcuts } from '@/composables/useUndoRedoShortcuts'
const tasksStore = useTasksStore()

useUndoRedoShortcuts(
  () => (tasksStore.mode === 'todo' ? tasksStore.undoTodoAction() : tasksStore.undoKanbanAction()),

  () => (tasksStore.mode === 'todo' ? tasksStore.redoTodoAction() : tasksStore.redoKanbanAction()),
)
</script>
<template>
  <div id="app">
    <div class="router">
      <button :class="{ active: tasksStore.mode === 'todo' }" @click="tasksStore.setMode('todo')">
        Todo
      </button>
      <span>|</span>
      <button
        :class="{ active: tasksStore.mode === 'kanban' }"
        @click="tasksStore.setMode('kanban')"
      >
        Kanban
      </button>
    </div>
    <TodoView v-if="tasksStore.mode === 'todo'" />
    <KanbanView v-if="tasksStore.mode === 'kanban'" />

    <div v-if="!tasksStore.mode">Выберите режим</div>
  </div>
</template>

<style scoped>
.router {
  display: flex;
  margin: auto;
  width: 60%;
  justify-content: center;
  gap: 20px;
  text-align: center;
  margin-bottom: 10px;
}
button {
  flex-grow: 1;
  margin: 0 10px;
  text-decoration: none;
  color: black;
  font-size: 16px;
  background-color: white;
}
button:hover {
  background: #48c172;
}
button:active {
  background: #48c172;
}
</style>
