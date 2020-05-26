import Vuex from 'vuex';
import Vue from 'vue';
import scorecard from './modules/scorecard';
import course from './modules/course';
import player from './modules/player';

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
	modules: {
		scorecard,
		course,
		player
	}
});