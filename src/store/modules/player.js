import repository from '../repository';
import router from '../../router';
import cookies from 'vue-cookies';
import course from './course';

const state = {
	isAuthenticated: false,
	favouriteCourse: JSON.parse(localStorage.getItem('favouriteCourse')),
	recieveAddedToScorecardMail: localStorage.getItem('recieveAddedToScorecardMail'),
	showLatestYearOnly: localStorage.getItem('showLatestYearOnly'),
	players: []
};

const getters = {
	isAuthenticated: (state) => {
		return state.isAuthenticated;
	},
	players: state => state.players,
	favouriteCourse: state => state.favouriteCourse,
	recieveAddedToScorecardMail: state => state.recieveAddedToScorecardMail,
	showLatestYearOnly: state => state.showLatestYearOnly
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
		).then((response) => {

			state.isAuthenticated = true;
			localStorage.setItem('favouriteCourse', JSON.stringify(response.data.favouriteCourse));
			localStorage.setItem('recieveAddedToScorecardMail', response.data.recieveAddedToScorecardMail);
			localStorage.setItem('showLatestYearOnly', response.data.showLatestYearOnly);
			state.favouriteCourse = response.data.favouriteCourse;
			state.recieveAddedToScorecardMail = response.data.recieveAddedToScorecardMail;
			state.showLatestYearOnly = response.data.showLatestYearOnly;
			
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
	},

	async updateSettings({ commit }, {favouriteCourse, recieveAddedToScorecardMail, showLatestYearOnly}) {

		await repository.put(`/${endpoint}/updateSettings`,
			{
				favouriteCourse: favouriteCourse,
				recieveAddedToScorecardMail: recieveAddedToScorecardMail,
				showLatestYearOnly: showLatestYearOnly
			},
			{
				withCredentials: true
			}	
		).then((response) => {

			localStorage.setItem('favouriteCourse', JSON.stringify(response.data.favouriteCourse));
			localStorage.setItem('recieveAddedToScorecardMail', response.data.recieveAddedToScorecardMail);
			localStorage.setItem('showLatestYearOnly', response.data.showLatestYearOnly);
			state.favouriteCourse = response.data.favouriteCourse;
			state.recieveAddedToScorecardMail = response.data.recieveAddedToScorecardMail;
			state.showLatestYearOnly = response.data.showLatestYearOnly;

			return true;
			
		}).catch((error) => {
			console.log(error);
			return false;
		});
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