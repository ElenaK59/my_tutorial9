<script setup>
const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <button @click="emit('update:modelValue', 'all')">Все</button>
    <button @click="emit('update:modelValue', 'done')">Выполненные</button>
    <button @click="emit('update:modelValue', 'active')">Активные</button>
    <button @click="emit('update:modelValue', 'important')">Важные</button>
    <button @click="emit('update:modelValue', 'deferred')">Отложенные</button>
  </div>
</template>
<style scoped>
/* .filters {
  width: 100%;
} */
button {
  padding: 6px 12px;
  border: none;
  background: #eee;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}
button:hover {
  background: #48c172;
}
button:active {
  background: #48c172;
}
</style>
