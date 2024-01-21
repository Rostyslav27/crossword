import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes:RouteRecordRaw[] = [
  {
    path: '/',
    name: 'levels',
    component: () => import('../pages/selectLevel.page.vue'),
  },
  {
    path: '/level/:levelid',
    name: 'level',
    component: () => import('../pages/level.page.vue'),
  }
];



const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
