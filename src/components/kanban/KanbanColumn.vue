<script setup>
import { computed } from 'vue'
import { useTasksStore } from '@/stores/useTasksStore'
import KanbanTaskList from '@/components/task/KanbanTaskList.vue'
import TaskInput from '@/components/task/TaskInput.vue'
import { useDrag } from '@/composables/useDrag'
import { useDragStore } from '@/composables/useDragStore'

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})
const dragStore = useDragStore()
const drag = useDrag()

const tasksStore = useTasksStore()

const tasks = computed(() => tasksStore.tasksByStatus(props.column.id))
const isDraggingColumn = computed(() => dragStore.dragType.value === 'column')

const removeColumn = () => {
  tasksStore.removeColumn(props.column.id)
}

function addTaskToColumn({ text }) {
  tasksStore.addTask(text, props.column.id)
}
</script>

<template>
  <div
    class="column"
    :class="{
      active: isDraggingColumn,
      dragging: dragStore.sourceColumnIndex === index,
      'drag-over': dragStore.targetColumnIndex === index,
    }"
    :draggable="!!drag.isColumnDraggable"
    @dragstart="drag.startColumnDrag(index)"
    @dragover.prevent="drag.dragOverColumn(index)"
    @drop.stop="drag.dropColumn()"
  >
    <h3>
      {{ column.title }}
      <button class="delete-btn-col" @click="removeColumn">✕</button>
    </h3>
    <TaskInput @add="addTaskToColumn" :column="column" />

    <KanbanTaskList :tasks="tasks" :column="column" :index="index" />
  </div>
</template>
<style scoped>
.column-move {
  transition: transform 0.3s ease;
}
.column-enter-active,
.column-leave-active {
  transition: all 0.3s ease;
}

.column-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.column-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.column {
  display: flex;
  flex-direction: column;
  flex: 0 0 280px; /* 🔥 фиксированная ширина */
  background: white;
  border-radius: 8px;
  padding: 10px;
}
.delete-btn-col {
  background: transparent;
  border: none;
  color: #d9534f;
  cursor: pointer;
  font-size: 14px;
}
</style>
