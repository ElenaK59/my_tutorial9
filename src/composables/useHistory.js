import { ref } from 'vue'

export function useHistory(limit = 50) {
  const historyKanban = ref([])
  const pointerKanban = ref(-1)

  const historyTodo = ref([])
  const pointerTodo = ref(-1)

  function clone(data) {
    return JSON.parse(JSON.stringify(data))
  }

  // ===== KANBAN =====
  function pushKanban(snapshot) {
    // обрезаем future
    if (pointerKanban.value < historyKanban.value.length - 1) {
      historyKanban.value.splice(pointerKanban.value + 1)
    }

    historyKanban.value.push(clone(snapshot))
    pointerKanban.value++

    if (historyKanban.value.length > limit) {
      historyKanban.value.shift()
      pointerKanban.value--
    }
  }

  function undoKanban() {
    if (pointerKanban.value <= 0) return null
    pointerKanban.value--
    return historyKanban.value[pointerKanban.value]
  }

  function redoKanban() {
    if (pointerKanban.value >= historyKanban.value.length - 1) return null
    pointerKanban.value++
    return historyKanban.value[pointerKanban.value]
  }

  // ===== TODO =====
  function pushTodo(todoTasks) {
    if (pointerTodo.value < historyTodo.value.length - 1) {
      historyTodo.value.splice(pointerTodo.value + 1)
    }

    historyTodo.value.push(clone(todoTasks))
    pointerTodo.value++

    if (historyTodo.value.length > limit) {
      historyTodo.value.shift()
      pointerTodo.value--
    }
  }

  function undoTodo() {
    if (pointerTodo.value <= 0) return null
    pointerTodo.value--
    return historyTodo.value[pointerTodo.value]
  }

  function redoTodo() {
    if (pointerTodo.value >= historyTodo.value.length - 1) return null
    pointerTodo.value++
    return historyTodo.value[pointerTodo.value]
  }

  return {
    historyKanban,
    pointerKanban,
    pushKanban,
    undoKanban,
    redoKanban,

    historyTodo,
    pointerTodo,
    pushTodo,
    undoTodo,
    redoTodo,
  }
}
