<script setup>
import KanbanColumn from './KanbanColumn.vue'
import { useDragStore } from '@/composables/useDragStore'
import { useTasksStore } from '@/stores/useTasksStore'
const dragStore = useDragStore()
const tasksStore = useTasksStore()
</script>
<template>
  <div class="board">
    <template v-for="(column, index) in tasksStore.columns" :key="column.id">
      <!-- placeholder -->
      <div v-if="dragStore.targetColumnIndex === index" class="column-placeholder"></div>

      <KanbanColumn :column="column" :index="index" />
    </template>

    <!-- placeholder в конец -->
    <div
      v-if="dragStore.targetColumnIndex === tasksStore.columns.length"
      class="column-placeholder"
    ></div>
  </div>
</template>
<style scoped>
.board {
  display: flex;
  gap: 20px;
  overflow-x: auto; /* 🔥 ключевое */
  align-items: flex-start;
}
.column-placeholder {
  width: 250px;
  height: 100%;
  border: 2px dashed #aaa;
  border-radius: 8px;
  margin: 0 8px;
}

.column.dragging {
  opacity: 0.5;
}

.column.drag-over {
  transform: scale(1.05);
}
</style>
