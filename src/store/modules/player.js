import repository from '../repository';
import router from '../../router';
import cookies from 'vue-cookies';

const state = {
	isAuthenticated: false,
	players: []
};

const getters = {
	isAuthenticated: (state) => {
		return state.isAuthenticated;
	},
	players: state => state.players
};

const endpoint = 'player';

const actions = {
	async getPlayers({ commit }) {
		const response = await repository.get(`/${endpoint}`, 
			{
				withCredentials: true
			}
		);
		commit('setPlayers', response.data);
	},

	async login({ commit }, {email, password}) {

		await repository.post(`/${endpoint}/login`,
            {
				email: email,
				password: password
			},
			{
				withCredentials: true
			}
		).then(function eat() {
			state.isAuthenticated = true;
			router.push(router.currentRoute.query.redirect || '/');
			return true;

		}).catch((error) => {
			
			if (error.data.errorcode === 1) {
				state.isAuthenticated = false;
				return false;
			}
		});
	},

	logout({ commit }) {
		cookies.remove('token');
		state.isAuthenticated = false;
		if (router.currentRoute.path !== '/') {
			router.push('/');
		}
	}
};

const mutations = {
	setPlayers: (state, players) => (state.players = players),
	setIsAuthenticated: (state, value) => (state.isAuthenticated = value)
};

export default {
	state,
	getters,
	actions,
	mutations
};