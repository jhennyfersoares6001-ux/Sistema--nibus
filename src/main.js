import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useSistemaStore } from './stores/sistema.js'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// carrega os dados do Dexie antes de mostrar o site
useSistemaStore(pinia)
  .carregarDados()
  .finally(() => app.mount('#app'))