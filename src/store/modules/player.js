import repository from '../repository';
import router from '../../router';
import VueCookies from 'vue-cookies';

const state = {
	isAuthenticated: false,
	isVerified: false,
	favouriteCourse: 'all',
	recieveAddedToScorecardMail: false,
	showLatestYearOnly: false,
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


			console.log(response.data);
			commit('setIsVerified', response.data.isVerified);

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
		repository.post(`/${endpoint}/logout`,
		{
		
		},
		{
			withCredentials: true
		}).then(() => {
			commit('setIsAuthenticated', false);
			VueCookies.remove('access_token');
			VueCookies.remove('refresh_token');	
				
			if (router.currentRoute.path !== '/') {
				router.push('/');
			}
		}).catch(() => {
			commit('setIsAuthenticated', false);
			VueCookies.remove('access_token');
			VueCookies.remove('refresh_token');	

			if (router.currentRoute.path !== '/') {
				router.push('/');
			}
		})
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

			}).catch(() => {
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
	},

	setCookieValues({commit}) {
		commit('setIsAuthenticated', VueCookies.isKey('refresh_token'));
		commit('setIsVerified', JSON.parse(VueCookies.get('isVerified')));
		commit('setFavouriteCourse', JSON.parse(localStorage.getItem('favouriteCourse')));
		commit('setRecieveAddedToScorecardMail', JSON.parse(localStorage.getItem('recieveAddedToScorecardMail')));
		commit('setShowLatestYearOnly', JSON.parse(localStorage.getItem('showLatestYearOnly')));
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