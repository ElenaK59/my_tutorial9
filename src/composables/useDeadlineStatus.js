import { computed } from 'vue'

export function useDeadlineStatus(deadlineRef, labels = {}) {
  const defaultLabels = {
    overdue: 'Просрочено',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    future: 'Будущее',
  }

  const text = { ...defaultLabels, ...labels }

  return computed(() => {
    const value = deadlineRef()

    if (!value) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const deadline = new Date(value)
    deadline.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((deadline - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: text.overdue, class: 'overdue' }
    }

    if (diffDays === 0) {
      return { label: text.today, class: 'today' }
    }

    if (diffDays === 1) {
      return { label: text.tomorrow, class: 'tomorrow' }
    }

    return { label: text.future, class: 'future' }
  })
}
