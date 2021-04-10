import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import VueCookies from 'vue-cookies';

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
	
	if (!VueCookies.isKey('refresh_token')) {
		next();
		return true;
	}

	next('/');
}

const ifAuthenticated = (to, from, next) => {

	if (VueCookies.isKey('refresh_token')) {
		next();
		return true;
	}

	router.push({ path: '/login', query: { redirect: to.path} });
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
		},
		{
			path: '/profile',
			name: 'ProfilePage',
			component: () => import('./components/pages/ProfilePage'),
			beforeEnter: ifAuthenticated
		}
	]
});

export default router;	