import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'top',
      component: () => import('../views/TopView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/section/:sectionId?',
      name: 'section',
      component: () => import('../views/SectionView.vue'),
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
    },
    // 後方互換性のためのリダイレクト
    {
      path: '/content/:sectionId',
      redirect: to => `/section/${to.params.sectionId}`
    },
    {
      path: '/reflection/:sectionId',
      redirect: to => `/section/${to.params.sectionId}`
    },
  ],
})

export default router
