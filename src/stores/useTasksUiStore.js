import { ref, computed } from 'vue'

let store

export function useTasksUiStore() {
  if (store) return store

  const filter = ref('all')
  const search = ref('')
  const sortMode = ref('manual')

  function getFilteredTasks(tasks) {
    let result = [...tasks]

    // FILTER
    const filters = {
      active: (t) => !t.done,
      done: (t) => t.done,
      important: (t) => t.important,
      deferred: (t) => t.deferred,
    }

    result = result.filter(filters[filter.value] || (() => true))

    // SEARCH
    if (search.value.trim()) {
      const q = search.value.toLowerCase()

      result = result.filter((t) => t.text.toLowerCase().includes(q))
    }

    // SORT
    if (sortMode.value === 'alpha') {
      result.sort((a, b) => a.text.localeCompare(b.text))
    } else if (sortMode.value === 'status') {
      result.sort((a, b) => Number(a.done) - Number(b.done))
    } else if (sortMode.value === 'deadline') {
      result.sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      })
    } else if (sortMode.value === 'manual') {
      result.sort((a, b) => a.position - b.position)
    }

    return result
  }

  const isManualSort = computed(() => sortMode.value === 'manual')

  store = {
    filter,
    search,
    sortMode,
    getFilteredTasks,
    isManualSort,
  }

  return store
}
