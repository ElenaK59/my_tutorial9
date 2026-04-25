<script setup>
import { useTasksStore } from '@/stores/useTasksStore'
const tasksStore = useTasksStore()
</script>
<template>
  <div class="history-debug">
    <h3>Todo History</h3>

    <div
      v-for="(item, index) in tasksStore.historyTodo"
      :key="index"
      :style="{
        padding: '8px',
        margin: '4px 0',
        border: index === tasksStore.pointerTodo ? '2px solid red' : '1px solid #ccc',
      }"
    >
      <div><b>Index:</b> {{ index }}</div>

      <div><b>Tasks count:</b> {{ item.length }}</div>

      <div>
        <b>Tasks:</b>
        <ul>
          <li v-for="t in item" :key="t.id">
            {{ t.text }} ({{ t.status }}) вып ({{ t.done }}) важная ({{ t.important }}) отложена ({{
              t.deferred
            }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
