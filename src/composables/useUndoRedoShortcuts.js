import { onMounted, onUnmounted } from 'vue'

export function useUndoRedoShortcuts(undo, redo) {
  function handleKeydown(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      undo()
    }

    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      redo()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
