<script setup>
import { useTasksStore } from '@/stores/useTasksStore'
const tasksStore = useTasksStore()
</script>
<template>
  <div class="history-debug">
    <h3>Kanban History</h3>

    <div
      v-for="(item, index) in tasksStore.historyKanban"
      :key="index"
      :style="{
        padding: '8px',
        margin: '4px 0',
        border: index === tasksStore.pointerKanban ? '2px solid red' : '1px solid #ccc',
      }"
    >
      <div><b>Index:</b> {{ index }}</div>

      <div><b>Tasks count:</b> {{ item.tasks.length }}</div>

      <div>
        <b>Tasks:</b>
        <ul>
          <li v-for="t in item.tasks" :key="t.id">{{ t.text }} ({{ t.status }})</li>
        </ul>
      </div>
    </div>
    <div
      v-for="(item, index) in tasksStore.historyKanban"
      :key="index"
      :style="{
        padding: '8px',
        margin: '4px 0',
        border: index === tasksStore.pointerKanban ? '2px solid red' : '1px solid #ccc',
      }"
    >
      <div><b>Index:</b> {{ index }}</div>

      <div><b>Columns count:</b> {{ item.columns.length }}</div>

      <div>
        <b>Columns:</b>
        <ul>
          <li v-for="t in item.columns" :key="t.id">{{ t.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
