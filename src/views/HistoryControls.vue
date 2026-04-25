<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/useTasksStore'
import TodoHistory from '@/components/task/TodoHistory.vue'
import KanbanHistory from '@/components/task/KanbanHistory.vue'
const tasksStore = useTasksStore()

const showHistory = ref(false)
const isTodoMode = computed(() => tasksStore.mode === 'todo')

function handleUndo() {
  isTodoMode ? tasksStore.undoTodoAction() : tasksStore.undoKanbanAction()
}

function handleRedo() {
  isTodoMode ? tasksStore.redoTodoAction() : tasksStore.redoKanbanAction()
}

function handleTrim() {
  tasksStore.trimHistory(isTodoMode ? 'todo' : 'kanban', trimCount.value)
}

const pointer = computed(() =>
  isTodoMode.value ? tasksStore.pointerTodo : tasksStore.pointerKanban,
)

const historyLength = computed(() =>
  isTodoMode.value ? tasksStore.historyTodo.length : tasksStore.historyKanban.length,
)
const canUndo = computed(() => pointer.value > 0)

const canRedo = computed(() => pointer.value < historyLength.value - 1)

const trimCount = ref(5)
</script>
<template>
  <div class="history-controls">
    <!-- Todo кнопки -->
    <span>
      {{ isTodoMode ? 'Todo' : 'Kanban' }}:
      {{ isTodoMode ? tasksStore.pointerTodo : tasksStore.pointerKanban }}
    </span>

    <button @click="handleUndo" :disabled="!canUndo">⬅ Undo</button>

    <button @click="handleRedo" :disabled="!canRedo">➡ Redo</button>

    <input v-model.number="trimCount" type="number" min="1" />

    <button @click="handleTrim">Оставить последние</button>

    <button class="showHistory" @click="showHistory = !showHistory">Просмотреть историю</button>

    <component v-show="showHistory" :is="isTodoMode ? TodoHistory : KanbanHistory" />
  </div>
</template>

<style scoped>
input[type='number'] {
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-left: 20px;
  height: 20px;
  width: 60px;
  box-sizing: border-box; /* Чтобы padding не увеличивал ширину */
}
.showHistory {
  margin-top: 10px;
}
.kanban .showHistory {
  margin-left: 10px;
}
</style>
