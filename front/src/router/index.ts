import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import HomeView from '../views/HomeView.vue';
// @ts-ignore
import RegisterView from '../views/RegisterView.vue';
// @ts-ignore
import FeedView from '../views/FeedView.vue';

import { useAuthStore } from '@/stores/AuthStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/feed',
      name: 'Feed',
      component: FeedView
    },
    {
      path: '/:pathMatch(.*)*',
      component: HomeView
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicRoutes = ['Home', 'Register'];

  if (!publicRoutes.includes(to.name as string) && !useAuthStore().userIsRegistered) {
    router.replace({ name : 'Home' });
    next();
    return false;
  }

  next();
})

export default router;
