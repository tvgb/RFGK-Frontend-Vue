import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import VueCookies from 'vue-cookies';

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
	if (!store.isAuthenticated) {
		next();
		return true;
	}

	next('/');
};

const ifAuthenticated = (to, from, next) => {

	if (store.state.player.isAuthenticated) {
		next();
		return true;
	}

	router.push({ path: '/login', query: { redirect: to.path} });
};

const ifHasAccessCookie = (to, form, next) => {
	if (VueCookies.isKey('access_token')) {
		next();
		return true;
	}

	router.push({ path: '/' });
};

let router = new Router({
	mode: 'history',
	hash: false,
	routes: [
		{
			path: '/',
			name: 'Scorecard',
			component: () => import('./components/pages/ScorecardPage')
		},
		{
			path: '/league',
			name: 'LeaguePage',
			component: () => import('./components/pages/LeaguePage')
		},
		{
			path: '/login',
			name: 'LoginPage',
			component: () => import('./components/pages/LoginPage'),
			beforeEnter: ifNotAuthenticated
		},
		{
			path: '/getResetPasswordEmail',
			name: 'GetResetPasswordEmailPage',
			component: () => import('./components/pages/GetResetPasswordEmailPage'),
			beforeEnter: ifNotAuthenticated
		},
		{
			path: '/resetPassword',
			name: 'ResetPasswordPage',
			component: () => import('./components/pages/ResetPasswordPage'),
			beforeEnter: ifHasAccessCookie,
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