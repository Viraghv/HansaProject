import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'Vasarlasok',
    path: '/',
    component: () => import('@/views/Vasarlasok.vue')
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
