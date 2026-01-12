import { createRouter, createWebHistory } from 'vue-router'
import ConfessView from '../views/ConfessView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'confess',
      component: ConfessView,
    },
  ],
})

export default router
