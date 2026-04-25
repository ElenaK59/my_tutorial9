export function useHistory() {
  const past = []
  const future = []

  function push(state) {
    past.push(JSON.parse(JSON.stringify(state)))
    future.length = 0
  }

  function undo(current) {
    if (!past.length) return current

    const prev = past.pop()
    future.push(JSON.parse(JSON.stringify(current)))
    return prev
  }

  function redo(current) {
    if (!future.length) return current

    const next = future.pop()
    past.push(JSON.parse(JSON.stringify(current)))
    return next
  }

  return { past, future, push, undo, redo }
}
