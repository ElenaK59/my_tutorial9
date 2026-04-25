<script setup>
import { computed } from 'vue'
import { useEditable } from '@/composables/useEdittable'
import { useTaskMeta } from '@/composables/useTaskMeta'
import TaskActions from './TaskActions.vue'
import { useTasksStore } from '@/stores/useTasksStore'
import { useDrag } from '@/composables/useDrag'
import { useDragStore } from '@/composables/useDragStore'
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  column: {
    type: Object, // 👈 теперь объект { id, title }
    required: true,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
})
const tasksStore = useTasksStore()
const { editingId, editingText, startEdit, setEditRef, handleKeydown } = useEditable()
const meta = useTaskMeta(() => props.task)
const drag = useDrag()
const dragStore = useDragStore()
const columnId = computed(() => props.column?.id ?? props.task.status)

function onToggleImportant(id) {
  tasksStore.toggleTaskField(id, 'important')
}

function onToggleDeferred(id) {
  tasksStore.toggleTaskField(id, 'deferred')
}
function onRemove(id) {
  tasksStore.removeTask(id)
}
</script>
<template>
  <li
    class="task-item"
    :class="[meta.classes, { dragging: dragStore.draggedTaskId === task.id }]"
    :draggable="!!drag.isTaskDraggable"
    @dragstart="drag.startDrag(task.id, columnId, $event)"
    @dragover.prevent="drag.dragOverTask(columnId, task.id)"
    @drop="drag.dropOnTask(columnId)"
  >
    <template v-if="editingId !== task.id">
      <input
        class="task-checkbox"
        type="checkbox"
        :checked="task.done"
        @change="tasksStore.toggleTaskField(task.id, 'done')"
      />
      <span class="task-text" @dblclick="startEdit(task.id, task.text)">
        {{ task.text }}
      </span>
      <span v-if="meta.deadlineInfo" class="deadline" :class="meta.deadlineInfo.class">
        {{ meta.deadlineInfo.label }}
        {{ task.deadline }}
      </span>
    </template>
    <input
      v-else
      :ref="(el) => setEditRef(task.id, el)"
      :value="editingText"
      @input="editingText = $event.target.value"
      @keydown="handleKeydown"
    />
    <TaskActions
      :task="task"
      @toggle-important="onToggleImportant"
      @toggle-deferred="onToggleDeferred"
      @remove="onRemove"
    />
  </li>
</template>
<style scoped>
.task-item {
  display: flex;
  justify-content: space-between; /* Распределяет текст и кнопку по краям */
  align-items: center; /* Выравнивает элементы по вертикали */
  background: white;
  padding: 8px;
  font-size: 14px;
  margin-bottom: 6px;
  border-radius: 4px;
  width: 100%;
  /*cursor: grab;*/
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
  will-change: transform;
}
.task-item:active {
  cursor: grabbing;
}

.task-item.dragging {
  opacity: 0.2;
  transform: scale(0.98);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.task-text {
  flex: 1;
  min-width: 0; /* КРИТИЧНО */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 12px;
}
.deadline {
  font-size: 12px;
  color: #888;
  margin-left: 8px;
}
.deadline.overdue {
  color: red;
  font-weight: bold;
}
.deadline.today {
  background: #fff3e0;
  color: #ef6c00;
}

.deadline.tomorrow {
  background: #e3f2fd;
  color: #1565c0;
}

.deadline.future {
  background: #e8f5e9;
  color: #2e7d32;
}
.task-checkbox {
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  margin-left: 4px;
  cursor: pointer;
  accent-color: #4caf50;
}
</style>
