import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach((to, from, next) => {
  const access_token = localStorage.getItem('access_token');
  const isAuthenticated = access_token !== null;
  
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login'); // Redirect to login only if not already on the login page
  } else {
    next(); // Continue navigation
  }
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

export default router
