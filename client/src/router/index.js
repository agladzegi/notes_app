import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

Vue.use(VueRouter);

function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next('/dashboard');
  } else {
    next();
  }
}

function isGuest(to, from, next) {
  if (!localStorage.token) {
    next('/');
  } else {
    next();
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: isGuest,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: isLoggedIn,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
