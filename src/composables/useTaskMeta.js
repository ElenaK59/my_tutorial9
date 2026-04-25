import { computed } from 'vue'
import { useDeadlineStatus } from './useDeadlineStatus'

export function useTaskMeta(taskRef) {
  const deadlineInfo = useDeadlineStatus(() => taskRef().deadline || null)
  const flags = computed(() => {
    const t = taskRef()

    return {
      done: t.done,
      important: t.important,
      deferred: t.deferred,
      overdue: deadlineInfo.value?.class === 'overdue',
    }
  })

  const classes = computed(() => ({
    'task-done': flags.value.done,
    'task-important': flags.value.important,
    'task-deferred': flags.value.deferred,
    'task-overdue': flags.value.overdue,
  }))

  return {
    deadlineInfo: deadlineInfo.value,
    flags,
    classes,
  }
}
