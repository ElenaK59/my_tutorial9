import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useHistory } from '@/composables/useHistory'
export const useTasksStore = defineStore('tasks', () => {
  // STATE
  const tasks = ref([])
  const columns = ref([
    { id: 'todo', title: 'Мои задачи' },
    { id: 'progress', title: 'В процессе' },
    { id: 'done', title: 'Готово' },
  ])
  const savedMode = localStorage.getItem('mode')
  const mode = ref(savedMode || 'todo')

  const {
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
  } = useHistory(50)
  const saved = localStorage.getItem('vue-todo-kanban')
  const parsed = saved ? JSON.parse(saved) : null

  if (parsed) {
    tasks.value = parsed.tasks ?? []
    columns.value = parsed.columns ?? columns.value

    historyKanban.value = parsed.historyKanban ?? []
    pointerKanban.value = parsed.pointerKanban ?? historyKanban.value.length - 1

    historyTodo.value = parsed.historyTodo ?? []
    pointerTodo.value = parsed.pointerTodo ?? historyTodo.value.length - 1
  }
  if (!historyKanban.value.length) {
    const snapshot = getSnapshot()

    historyKanban.value.push(snapshot)
    pointerKanban.value = 0

    historyTodo.value.push(extractTodo(snapshot))
    pointerTodo.value = 0
  }
  function applySnapshot(snapshot) {
    tasks.value = JSON.parse(JSON.stringify(snapshot.tasks ?? []))
    columns.value = JSON.parse(JSON.stringify(snapshot.columns ?? []))
  }

  function setMode(newMode) {
    mode.value = newMode
    localStorage.setItem('mode', newMode)
  }

  // GETTERS
  function tasksByStatus(status) {
    return (tasks.value ?? [])
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position)
  }
  function createSnapshot(tasks, columns) {
    return {
      tasks: tasks.map((t) => ({
        id: t.id,
        text: t.text,
        deadline: t.deadline,
        status: t.status,
        done: t.done,
        important: t.important,
        deferred: t.deferred,
        position: t.position,
      })),
      columns: columns.map((c) => ({
        id: c.id,
        title: c.title,
      })),
    }
  }

  // INTERNAL

  function getSnapshot() {
    return createSnapshot(tasks.value ?? [], columns.value ?? [])
  }

  function extractTodo(snapshot) {
    return snapshot.tasks.filter((t) => t.status === 'todo')
  }

  function commitHistory(meta = {}) {
    const snapshot = getSnapshot()

    pushKanban(snapshot)

    if (meta.todoChanged) {
      const todo = extractTodo(snapshot)

      // ❗ важно: не пересоздавать snapshot второй раз
      pushTodo(todo)
    }
  }

  // ACTIONS
  function addTask(text, deadline, status) {
    if (!text.trim()) return

    const defaultStatus = columns.value[0].id
    const actualStatus = status ?? defaultStatus

    const columnTasks = tasks.value.filter((t) => t.status === actualStatus)

    tasks.value.push({
      id: Date.now(),
      text,
      deadline,
      status: actualStatus,
      done: false,
      important: false,
      deferred: false,
      position: columnTasks.length,
    })

    commitHistory({
      todoChanged: actualStatus === 'todo',
    })
  }

  function updateTask(id, patch) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return

    const next = { ...task, ...patch }
    const isSame =
      task.text === next.text &&
      task.important === next.important &&
      task.deferred === next.deferred &&
      task.done === next.done

    if (isSame) return

    Object.assign(task, patch)

    commitHistory({
      todoChanged: task.status === 'todo',
    })
  }

  function toggleTaskField(id, field) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return

    updateTask(id, {
      [field]: !task[field],
    })
  }

  function getTasksCount(columnId) {
    return tasks.value.filter((t) => t.status === columnId).length
  }

  function removeTask(id) {
    const task = tasks.value.find((t) => t.id === id)
    tasks.value = tasks.value.filter((t) => t.id !== id)

    commitHistory({
      todoChanged: task.status === 'todo',
    })
  }

  function removeColumn(columnId) {
    const index = columns.value.findIndex((col) => col.id === columnId)
    if (index === -1) return

    columns.value.splice(index, 1)

    commitHistory({
      todoChanged: false,
    })
  }
  function addColumn(title) {
    if (!title.trim()) return

    columns.value.push({
      id: Date.now().toString(),
      title,
    })

    commitHistory({
      todoChanged: false,
    })
  }

  function moveTask(id, fromStatus, toStatus, targetIndex) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return

    // Удаляем из общего списка
    const wasTodo = task.status === 'todo'
    let remaining = tasks.value.filter((t) => t.id !== id)

    // Берём задачи целевой колонки
    let targetTasks = remaining
      .filter((t) => t.status === toStatus)
      .sort((a, b) => a.position - b.position)
    // Вставляем
    task.status = toStatus
    targetTasks.splice(targetIndex, 0, task)

    // Пересчитываем позиции
    targetTasks.forEach((t, i) => (t.position = i))

    // Остальные задачи
    const otherTasks = remaining.filter((t) => t.status !== toStatus)

    // 🔥 ВАЖНО: пересобираем ВСЁ
    tasks.value = [...otherTasks, ...targetTasks]
    const isTodo = toStatus === 'todo'

    commitHistory({
      todoChanged: wasTodo || isTodo,
    })
  }
  function moveColumn(fromIndex, toIndex) {
    const cols = [...columns.value]

    const [moved] = cols.splice(fromIndex, 1)
    cols.splice(toIndex, 0, moved)

    columns.value = cols
    commitHistory({
      todoChanged: false,
    })
  }
  function applySnapshot(snapshot) {
    tasks.value = JSON.parse(JSON.stringify(snapshot.tasks ?? []))
    columns.value = JSON.parse(JSON.stringify(snapshot.columns ?? []))
  }
  function mergeTodo(currentTasks, todoTasks) {
    const todoMap = new Map(todoTasks.map((t) => [t.id, t]))

    return currentTasks
      .map((t) => {
        if (t.status === 'todo') {
          return todoMap.get(t.id) || null // если задачи больше нет → удалим
        }
        return t
      })
      .filter(Boolean) // убираем удалённые todo
  }
  //
  function undoTodoAction() {
    const todo = undoTodo()
    if (!todo) return

    const current = historyKanban.value[pointerKanban.value]

    tasks.value = mergeTodo(current.tasks, todo)

    columns.value = current.columns

    // 👉 ВАЖНО: фиксируем в kanban
    pushKanban({
      tasks: tasks.value,
      columns: columns.value,
    })
  }
  function redoTodoAction() {
    const todo = redoTodo()
    if (!todo) return

    const current = historyKanban.value[pointerKanban.value]

    tasks.value = mergeTodo(current.tasks, todo)
    columns.value = current.columns

    pushKanban({
      tasks: tasks.value,
      columns: columns.value,
    })
  }
  function undoKanbanAction() {
    const state = undoKanban()
    if (!state) return

    applySnapshot(state)
  }
  function redoKanbanAction() {
    const state = redoKanban()
    if (!state) return

    applySnapshot(state)
  }

  function trimHistory(type, count) {
    if (type === 'todo') {
      trimHistoryArray(historyTodo, pointerTodo, count)
    }

    if (type === 'kanban') {
      trimHistoryArray(historyKanban, pointerKanban, count)
    }
  }
  function trimHistoryArray(historyRef, pointerRef, count) {
    const history = historyRef.value

    if (history.length <= count) return

    const start = history.length - count

    // обрезаем историю
    historyRef.value = history.slice(start)

    // корректируем pointer
    pointerRef.value = Math.max(0, pointerRef.value - start)
  }
  return {
    // state
    tasks,
    columns,

    // getters
    tasksByStatus,

    // actions
    addTask,
    updateTask,
    removeTask,
    removeColumn,
    addColumn,
    moveTask,
    undoTodoAction,
    redoTodoAction,
    undoKanbanAction,
    redoKanbanAction,
    trimHistory,
    toggleTaskField,
    moveColumn,
    getTasksCount,
    setMode,
    mode,

    // history (если нужно снаружи)
    historyKanban,
    pointerKanban,
    historyTodo,
    pointerTodo,
  }
})
