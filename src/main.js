import './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useTasksStore } from '@/stores/useTasksStore'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')

const store = useTasksStore()

store.$subscribe((_, state) => {
  localStorage.setItem(
    'vue-todo-kanban',
    JSON.stringify({
      tasks: state.tasks,
      columns: state.columns,

      // 🔥 ВАЖНО: сохраняем историю
      historyKanban: state.historyKanban,
      pointerKanban: state.pointerKanban,
      historyTodo: state.historyTodo,
      pointerTodo: state.pointerTodo,
    }),
  )
})
