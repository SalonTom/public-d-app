import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import HomeView from '../views/HomeView.vue';
// @ts-ignore
import RegisterView from '../views/RegisterView.vue';
// @ts-ignore
import CommonView from '../views/CommonView.vue';
// @ts-ignore
import FeedView from '../views/FeedView.vue';
// @ts-ignore
import ProjectView from '../views/ProjectView.vue';

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
      path: '/common',
      name: 'Common',
      component: CommonView,
      children : [
        {
          path: '/feed',
          name: 'Feed',
          component: FeedView
        },
        {
          path: '/project',
          name: 'My Project',
          component: ProjectView
        }
      ],
      redirect: { name : 'Feed' }
    },
    {
      path: '/:pathMatch(.*)*',
      component: HomeView
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicRoutes = ['Home'];

  if (!publicRoutes.includes(to.name as string) && useAuthStore().userStatus != 2) {

    if ((to.name as string) !== 'Register') {
      router.replace({ name : 'Home' });
      next();
      return false;
    }
  }

  next();
})

export default router;
