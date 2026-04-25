import { ref } from 'vue'

let store

export function useDragStore() {
  if (store) return store
  const dragType = ref(null)

  const sourceColumnIndex = ref(null) // откуда тащим
  const targetColumnIndex = ref(null) // куда наведены
  const hoverColumnId = ref(null)
  const hoverIndex = ref(null)
  const draggedTaskId = ref(null)
  const fromColumnId = ref(null)
  function reset() {
    dragType.value = null
    sourceColumnIndex.value = null
    targetColumnIndex.value = null
    hoverColumnId.value = null
    hoverIndex.value = null
    draggedTaskId.value = null
    fromColumnId.value = null

    document.body.classList.remove('dragging')
  }

  store = {
    dragType,
    sourceColumnIndex,
    targetColumnIndex,
    hoverColumnId,
    hoverIndex,
    draggedTaskId,
    fromColumnId,
    reset,
  }

  return store
}
