<script setup>
const props = defineProps({
  search: String,
})
const emit = defineEmits(['update:search'])
</script>

<template>
  <div class="toolbar">
    <!-- Сначала Filters -->
    <div class="toolbar-filters">
      <slot name="filters" />
    </div>

    <!--  Потом поиск + сортировка + история -->
    <div class="toolbar-main">
      <input
        class="search"
        type="text"
        placeholder="Поиск..."
        :value="search"
        @input="emit('update:search', $event.target.value)"
      />

      <slot name="sort" />
    </div>
  </div>
</template>
<style scoped>
.toolbar {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

.search {
  flex-grow: 1;
  padding: 8px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: text;
}
.toolbar-filters,
.toolbar-main {
  display: flex;
  justify-content: center;
  width: 80%;
  gap: 8px;
}
</style>
