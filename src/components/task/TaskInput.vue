<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/useTasksStore'
const newTaskText = ref('')
const newDeadline = ref(null)
const tasksStore = useTasksStore()
const props = defineProps({
  column: {
    type: Object,
    default: null, // 👈 ключевой момент
  },
})

function handleAdd() {
  const text = newTaskText.value
  const deadline = newDeadline.value

  if (!text.trim()) return

  const currentStatus = computed(() => props.column?.id ?? 'todo')
  tasksStore.addTask(text, deadline, currentStatus.value)

  newTaskText.value = ''
  newDeadline.value = null
}
function handleKeyEsc() {
  newTaskText.value = ''
}
</script>

<template>
  <div class="add-task">
    <input
      v-model="newTaskText"
      placeholder="Новая задача"
      @keyup.enter="handleAdd"
      @keyup.esc="handleKeyEsc"
    />
    <input v-model="newDeadline" type="date" />
    <button @click="handleAdd">Добавить</button>
  </div>
</template>
<style scoped>
.add-task {
  display: flex;
  gap: 6px;
}

.add-task input[type='text'] {
  flex: 2;
}

.add-task input[type='date'] {
  flex: 1;
}

.add-task button {
  flex: 0;
  white-space: nowrap;
}
</style>
