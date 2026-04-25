<script setup>
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'
import { useTasksUiStore } from '@/stores/useTasksUiStore'
import { useDragStore } from '@/composables/useDragStore'

const uiStore = useTasksUiStore()

const props = defineProps({
  tasks: {
    type: Array, // ❗ не Object
    required: true,
  },
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

function isPlaceholder(index) {
  return dragStore.hoverColumnId === props.column.id && dragStore.hoverIndex === index
}
const filteredTasks = computed(() => uiStore.getFilteredTasks(props.tasks))
</script>

<template>
  <transition-group tag="ul" class="task-list">
    <template v-for="(task, i) in filteredTasks" :key="task.id">
      <!-- placeholder ПЕРЕД задачей -->
      <li v-if="isPlaceholder(i)" class="drop-placeholder" :key="'placeholder-' + i"></li>

      <TaskItem :task="task" :index="i" :column="column" />
    </template>

    <!-- placeholder в конец -->
    <li
      v-if="isPlaceholder(filteredTasks.length)"
      class="drop-placeholder"
      key="placeholder-end"
    ></li>
  </transition-group>
</template>
<style scoped>
.task-list {
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #d4cfcf;
  padding: 6px;
  margin-bottom: 6px;
  border-radius: 4px;
  flex: 1; /*  заполняет колонку */
  min-height: 50px;
}
.task-move {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.task-enter-active,
.task-leave-active {
  transition: all 0.2s ease;
}

.task-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.task-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
