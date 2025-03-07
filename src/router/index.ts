import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { supabase } from '@/lib/supabaseClient';
import { useUserStore } from '@/stores/userStore';
import { Role } from '@/types/role';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { isAuthRequired: true },
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('@/views/auth/SignInView.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('@/views/auth/SignUpView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { isAuthRequired: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { isAuthRequired: true, requiredRole: Role.ADMIN },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  await userStore.fetchSession();

  if (to.meta.isAuthRequired && !userStore.isLoggedIn) {
    return '/sign-in';
  }

  if (to.meta.requiredRole && userStore.profile?.role !== to.meta.requiredRole) {
    return '/';
  }
});

export default router;
