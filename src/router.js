import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ScorecardPage',
      component: () => import('./components/pages/ScorecardPage')
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('./components/pages/LoginPage')
    }
  ]
})