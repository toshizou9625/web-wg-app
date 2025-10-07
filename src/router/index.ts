import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'top',
      component: () => import('../views/TopView.vue'),
      meta: { hideNavigation: true, requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/section/:sectionId?',
      name: 'section',
      component: () => import('../views/SectionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: { requiresAuth: true }
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

// 認証状態を確認する関数
const getCurrentUser = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(!!user)
    })
  })
}

// ナビゲーションガード
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const isAuthenticated = await getCurrentUser()

    if (!isAuthenticated) {
      next('/')
      return
    }
  }

  next()
})

export default router
