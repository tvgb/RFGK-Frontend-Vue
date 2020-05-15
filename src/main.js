import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import router from './router'
import store from './store';
import 'buefy/dist/buefy.css'

Vue.use(Buefy);
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app')
