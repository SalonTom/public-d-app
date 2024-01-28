import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import HomeView from '../views/HomeView.vue';
// @ts-ignore
import ProfileCreation from '../views/ProfileCreation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/profile-creation',
      name: 'Profile creation',
      component: ProfileCreation
    }
  ]
});

export default router;
