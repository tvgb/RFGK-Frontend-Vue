import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'
import store from './store';
import VueCookies from 'vue-cookies'
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTrashAlt);
library.add(faUser);

Vue.use(Buefy);
Vue.use(require('vue-moment'));
Vue.use(VueCookies);
Vue.component('font-awesome-icon', FontAwesomeIcon)


if (VueCookies.isKey('token')) {
	store.state.player.isAuthenticated = true
}

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
