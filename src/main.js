import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCookies from 'vue-cookies';
import Buefy from 'buefy';
import '@/assets/scss/main.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
	defaultIconComponent: 'vue-fontawesome',
	defaultIconPack: 'fas'
});
Vue.use(require('vue-moment'));
Vue.use(VueCookies);

Vue.config.productionTip = false;


if (VueCookies.isKey('refresh_token')) {
	store.dispatch('refreshAccessToken').finally(() => {
		new Vue({
			router,
			store,
			render: h => h(App),
		}).$mount('#app');
	})
} else {
	new Vue({
		router,
		store,
		render: h => h(App),
	}).$mount('#app');
}


