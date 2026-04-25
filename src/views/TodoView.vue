<script setup>
import { computed } from 'vue'
import TaskInput from '@/components/task/TaskInput.vue'
import TodoList from '@/components/todo/TodoList.vue'
import TasksToolbar from '@/components/task/TasksToolbar.vue'
import { useTasksStore } from '@/stores/useTasksStore'
import HistoryControls from '@/views/HistoryControls.vue'
const tasksStore = useTasksStore()
const status = computed(() => tasksStore.columns)
const statushead = status.value[0].title
function handleAddTask({ text, deadline }) {
  tasksStore.addTask(text, deadline, (status = status.value[0].id))
}
</script>
<template>
  <div class="container">
    <h1>{{ statushead }}</h1>
    <TasksToolbar />
    <TaskInput @add="handleAddTask" />

    <TodoList />
    <HistoryControls />
  </div>
</template>
<style scoped>
.container {
  background: white;
  padding: 20px 25px;
  border-radius: 8px;
  /* justify-content: center; */
  width: 600px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
