import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {

	if (!store.getters.isAuthenticated) {
		next();
		return;
	}

	next('/');
}

const ifAuthenticated = (to, from, next) => {

	if (store.getters.isAuthenticated) {
		next();
		return;
	}

	router.push({ path: '/login', query: { redirect: '/submitScorecard'} });
}


let router = new Router({
	mode: 'history',
	hash: false,
	routes: [
		{
			path: '/',
			name: 'ScorecardPage',
			component: () => import('./components/pages/ScorecardPage')
		},
		{
			path: '/login',
			name: 'LoginPage',
			component: () => import('./components/pages/LoginPage'),
			beforeEnter: ifNotAuthenticated
		},
		{
			path: '/submitScorecard',
			name: 'SubmitScorecardPage',
			component: () => import('./components/pages/SubmitScorecardPage'),
			beforeEnter: ifAuthenticated
		}
	]
});

export default router;	