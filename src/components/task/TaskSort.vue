<script setup>
const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <select
    class="sort-select"
    :value="modelValue"
    @change="emit('update:modelValue', $event.target.value)"
  >
    <option value="manual">Вручную</option>
    <option value="alpha">По алфавиту</option>
    <option value="status">По статусу</option>
    <option value="deadline">По дедлайну</option>
  </select>
</template>

<style scoped>
.sort-select {
  display: flex;
  gap: 6px;
  padding: 8px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
