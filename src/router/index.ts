import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
// import CryptoJS from "crypto-js";

// const userRole = CryptoJS.AES.decrypt(localStorage.getItem('userRole'), "role").toString(CryptoJS.enc.Utf8)
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
    next('/login'); // Redirect to login if not authenticated and trying to access any route other than /login
  } else if (to.path === '/login' && isAuthenticated) {
    next('/'); // Redirect to home if authenticated user tries to access /login
  } else {
    next(); // Continue navigation
  }
});


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
