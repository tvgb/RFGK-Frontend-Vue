import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import VueCookies from 'vue-cookies'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(Buefy, {
	defaultIconComponent: 'vue-fontawesome',
	defaultIconPack: 'fas'
});
Vue.use(require('vue-moment'));
Vue.use(VueCookies);
store.dispatch('setCookieValues');

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
