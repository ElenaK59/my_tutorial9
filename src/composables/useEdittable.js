import { ref, nextTick } from 'vue'
import { useTasksStore } from '@/stores/useTasksStore'

export function useEditable() {
  const tasksStore = useTasksStore()

  const editingId = ref(null)
  const editingText = ref('')
  const editInputs = new Map()

  function setEditRef(id, el) {
    if (el) editInputs.set(id, el)
  }

  async function startEdit(id, text) {
    editingId.value = id
    editingText.value = text

    await nextTick()

    const input = editInputs.get(id)
    if (!input) return

    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
  }

  function handleKeydown(e) {
    if (!editingId.value) return

    if (e.key === 'Enter') {
      e.preventDefault()
      confirmEdit()
    }

    if (e.key === 'Escape') {
      e.stopPropagation()
      e.preventDefault()
      cancelEdit()
    }
  }

  function confirmEdit() {
    if (!editingId.value) return

    const id = editingId.value
    const text = editingText.value

    // 🔥 сначала выходим из edit режима
    editingId.value = null

    // 🔥 потом обновляем store
    nextTick(() => {
      tasksStore.updateTask(id, {
        text,
      })
    })
  }

  function cancelEdit() {
    // ❗ просто выходим — НИКАКИХ save
    editingId.value = null
  }

  return {
    editingId,
    editingText,
    startEdit,
    confirmEdit,
    cancelEdit,
    setEditRef,
    handleKeydown,
  }
}
