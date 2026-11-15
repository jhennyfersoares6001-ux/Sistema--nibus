import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CadastroView from '../views/CadastroView.vue'
import AlunosView from '../views/AlunosView.vue'
import EditarView from '../views/EditarView.vue'
import ConfirmarView from '../views/ConfirmarView.vue'
import MotoristasView from '../views/MotoristasView.vue'
import AvisosView from '../views/AvisosView.vue'
import OnibusView from '../views/OnibusView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/cadastro', name: 'cadastro', component: CadastroView },
    { path: '/alunos', name: 'alunos', component: AlunosView},
    { path: '/alunos/:id/editar', name: 'editar', component: EditarView },
    { path: '/confirmar', name: 'confirmar', component: ConfirmarView },
    { path: '/motoristas', name: 'motoristas', component: MotoristasView },
    { path: '/avisos', name: 'avisos', component: AvisosView },
    { path: '/onibus', name: 'onibus', component: OnibusView },
  ],
})

export default router
