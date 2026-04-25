import { describe, it, expect } from 'vitest'
import { useHistory } from '../src/composables/useHistory'

describe('useHistory', () => {
  it('push adds state to past', () => {
    const history = useHistory()

    history.push({ value: 1 })

    expect(history.past.length).toBe(1)
  })

  it('undo returns previous state', () => {
    const history = useHistory()

    history.push({ value: 1 })
    history.push({ value: 2 })

    const result = history.undo({ value: 3 })

    expect(result.value).toBe(2)
  })

  it('redo returns next state', () => {
    const history = useHistory()

    history.push({ value: 1 })
    history.push({ value: 2 })

    history.undo({ value: 3 })

    const result = history.redo({ value: 2 })

    expect(result.value).toBe(3)
  })

  it('clears future after push', () => {
    const history = useHistory()

    history.push({ value: 1 })
    history.undo({ value: 2 })

    history.push({ value: 3 })

    expect(history.future.length).toBe(0)
  })

  it('does nothing when undo empty', () => {
    const history = useHistory()

    const result = history.undo({ value: 5 })

    expect(result.value).toBe(5)
  })
})
