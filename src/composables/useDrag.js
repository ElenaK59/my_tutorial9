import { computed } from 'vue'
import { useTasksStore } from '@/stores/useTasksStore'
import { useDragStore } from './useDragStore'
import { useTasksUiStore } from '@/stores/useTasksUiStore'
const uiStore = useTasksUiStore()
export function useDrag() {
  const tasksStore = useTasksStore()
  const dragStore = useDragStore()
  const isManual = uiStore.isManualSort

  const isTaskDraggable = computed(() => {
    return isManual.value && dragStore.dragType.value === 'task'
  })
  const isColumnDraggable = computed(() => {
    return isManual.value && dragStore.dragType.value !== 'task'
  })
  function startColumnDrag(index) {
    if (dragStore.dragType.value) return

    dragStore.dragType.value = 'column'
    dragStore.sourceColumnIndex.value = index

    document.body.classList.add('dragging')
  }
  function dragOverColumn(index) {
    if (dragStore.dragType.value !== 'column') return
    dragStore.targetColumnIndex.value = index
  }
  function dropColumn() {
    console.log('dropColumn:', dragStore.sourceColumnIndex.value, dragStore.targetColumnIndex.value)
    const from = dragStore.sourceColumnIndex.value
    const to = dragStore.targetColumnIndex.value
    console.log('from,to:', from, to)
    if (from === null || to === null || from === to) {
      dragStore.reset()
      return
    }

    tasksStore.moveColumn(from, to)

    dragStore.reset()
  }

  function handleDrop(index, columnId) {
    dragStore.targetColumnIndex.value = index
    dropColumn()

    dropOnTask(columnId)
  }

  function startDrag(taskId, columnId, event) {
    dragStore.dragType.value = 'task'
    dragStore.draggedTaskId.value = taskId
    dragStore.fromColumnId.value = columnId
    document.body.classList.add('dragging')
    console.log('event:', event)
    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
  }
  function getRealIndex(columnId, taskId) {
    const tasks = tasksStore.tasksByStatus(columnId)
    return tasks.findIndex((t) => t.id === taskId)
  }

  function dragOverTask(columnId, taskId) {
    if (dragStore.dragType.value !== 'task') return

    const index = getRealIndex(columnId, taskId)

    dragStore.hoverColumnId.value = columnId
    dragStore.hoverIndex.value = index
  }
  function dropOnTask(columnId) {
    if (dragStore.dragType.value !== 'task') return
    dragStore.hoverColumnId.value = columnId
    const columnTasks = tasksStore.tasksByStatus(columnId)
    const targetIndex = dragStore.hoverIndex.value ?? columnTasks.length
    tasksStore.moveTask(
      dragStore.draggedTaskId.value,
      dragStore.fromColumnId.value,
      dragStore.hoverColumnId.value,
      targetIndex,
    )

    dragStore.reset()
  }
  return {
    startDrag,
    dragOverTask,
    dropOnTask,
    startColumnDrag,
    dragOverColumn,
    dropColumn,
    handleDrop,
    isTaskDraggable,
    isColumnDraggable,
  }
}
