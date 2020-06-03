import repository from '../repository';
import router from '../../router';
import cookies from 'vue-cookies';

const state = {
	isAuthenticated: cookies.isKey('token'),
	isVerified: JSON.parse(cookies.get('isVerified')),
	favouriteCourse: JSON.parse(localStorage.getItem('favouriteCourse')),
	recieveAddedToScorecardMail: JSON.parse(localStorage.getItem('recieveAddedToScorecardMail')),
	showLatestYearOnly: JSON.parse(localStorage.getItem('showLatestYearOnly')),
	players: []
};

const getters = {

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

			commit('setIsAuthenticated', true);
			commit('setFavouriteCourse', response.data.favouriteCourse);
			commit('setRecieveAddedToScorecardMail', response.data.recieveAddedToScorecardMail);
			commit('setShowLatestYearOnly', response.data.showLatestYearOnly);
			commit('setIsVerified', JSON.parse(cookies.get('isVerified')));

			localStorage.setItem('favouriteCourse', JSON.stringify(response.data.favouriteCourse));
			localStorage.setItem('recieveAddedToScorecardMail', response.data.recieveAddedToScorecardMail);
			localStorage.setItem('showLatestYearOnly', response.data.showLatestYearOnly);
			
			router.push(router.currentRoute.query.redirect || '/');

		}).catch((error) => {
			
			if (error.response.status === 400) {
				commit('setIsAuthenticated', false);
			}
		});
	},

	logout({ commit }) {
		cookies.remove('token');
		commit('setIsAuthenticated', false);

		if (router.currentRoute.path !== '/') {
			router.push('/');
		}
	},

	updateSettings({ commit }, {favouriteCourse, recieveAddedToScorecardMail, showLatestYearOnly}) {
		return new Promise((resolve, reject) => {
			repository.put(`/${endpoint}/updateSettings`,
				{
					favouriteCourse: favouriteCourse,
					recieveAddedToScorecardMail: recieveAddedToScorecardMail,
					showLatestYearOnly: showLatestYearOnly
				},
				{
					withCredentials: true
				}	
			).then((response) => {

				commit('setFavouriteCourse', response.data.favouriteCourse);
				commit('setRecieveAddedToScorecardMail', response.data.recieveAddedToScorecardMail);
				commit('setShowLatestYearOnly', response.data.showLatestYearOnly);

				localStorage.setItem('favouriteCourse', JSON.stringify(response.data.favouriteCourse));
				localStorage.setItem('recieveAddedToScorecardMail', response.data.recieveAddedToScorecardMail);
				localStorage.setItem('showLatestYearOnly', response.data.showLatestYearOnly);

				resolve();

			}).catch((error) => {
				reject();
			});
		});
	},

	updatePersonalInfo({ commit }, {newEmail, newPassword, oldPassword}) {
		return new Promise((resolve, reject) => {
			repository.put(`/${endpoint}/updatePersonalInfo`, 
				{
					newEmail: newEmail,
					newPassword: newPassword,
					oldPassword: oldPassword
				},
				{
					withCredentials: true
				}
			).then(() => {
				resolve();
			}).catch((error) => {
				reject(error);
			});
		});
	},

	sendVerificationMail({commit}) {
		return new Promise((resolve, reject) => {
			repository.put(`/${endpoint}/sendVerificationMail`,
				{

				},
				{
					withCredentials: true
				}
			).then(() => {
				resolve();
			}).catch((error) => {
				reject(error);
			});
		});
	}
};

const mutations = {
	setPlayers: (state, players) => (state.players = players),
	setIsAuthenticated: (state, value) => (state.isAuthenticated = value),
	setFavouriteCourse: (state, course) => (state.favouriteCourse = course),
	setRecieveAddedToScorecardMail: (state, value) => (state.recieveAddedToScorecardMail = value),
	setShowLatestYearOnly: (state, value) => (state.showLatestYearOnly = value),
	setIsVerified: (state, value) => (state.isVerified = value)
};

export default {
	state,
	getters,
	actions,
	mutations
};