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
	players: state => {
		let players = state.players;
		const mostUsed = JSON.parse(localStorage.getItem('mostUsed'));

		if (mostUsed) {
			players = players.map((player) => {
				const usedPlayer = mostUsed.players.find(p => p._id === player._id);
				const uses = usedPlayer ? usedPlayer.uses : 0;
				Object.assign(player, {uses: uses});

				return player;
			});

			players = players.sort((a, b) => {
				if (a.uses > b.uses) {
					return -1;
				} else if (a.uses < b.uses) {
					return 1;
				} else {
					return 0;
				}
			});
		}

		return players;
	} 
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

	login({ dispatch }, {email, password}) {

		return repository.post(`/${endpoint}/login`,
            {
				email: email,
				password: password
			},
			{
				withCredentials: true
			}
		).then((res) => {
			dispatch('setCookieValues', {
				isAuthenticated: true,
				isVerified: res.data.isVerified,
				favouriteCourse: res.data.favouriteCourse,
				recieveAddedToScorecardMail: res.data.recieveAddedToScorecardMail,
				showLatestYearOnly: res.data.showLatestYearOnly
			});	

			router.push(router.currentRoute.query.redirect || '/');
			return res;
		});
	},

	logout({ dispatch }) {
		repository.post(`/${endpoint}/logout`,
		{
		
		},
		{
			withCredentials: true
		}).finally(() => {
			VueCookies.remove('access_token');
			VueCookies.remove('refresh_token');	

			dispatch('setCookieValues', {
				isAuthenticated: false,
				isVerified: false,
				favouriteCourse: 'all',
				recieveAddedToScorecardMail: false,
				showLatestYearOnly: false
			});	

			if (router.currentRoute.path !== '/') {
				router.push('/');
			}
		});
	},

	signUp({ commit }, { email, firstName, lastName, birthday, password }) {
		console.log('yes????');
		return repository.post((`/${endpoint}/signup`),
		{
			email,
			firstName,
			lastName,
			birthday,
			password
		});
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
				resolve();

			}).catch(() => {
				reject();
			});
		});
	},

	resetPassword({}, {password}) {
		return repository.put(`${endpoint}/resetPassword`, 
			{
				password: password
			},
			{
				withCredentials: true
			}
		);
	},

	updatePersonalInfo({}, {newEmail, newPassword, oldPassword}) {
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

	sendResetPasswordEmail({}, {email}) {
		return repository.put(`/${endpoint}/sendResetPasswordEmail`,
			{
				email: email
			},
			{
				withCredentials: true
			}
		);
	},

	sendVerificationEmail({}) {
		return new Promise((resolve, reject) => {
			repository.put(`/${endpoint}/sendVerificationEmail`,
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

	refreshAccessToken({ dispatch }) {
		return repository.post(`/${endpoint}/refreshToken`,{}, { withCredentials: true })
			.then((res) => {
				dispatch('setCookieValues', {
					isAuthenticated: true,
					isVerified: res.data.isVerified,
					favouriteCourse: res.data.favouriteCourse,
					recieveAddedToScorecardMail: res.data.recieveAddedToScorecardMail,
					showLatestYearOnly: res.data.showLatestYearOnly
				});				
			})
			.catch(() => {
				dispatch('setCookieValues', {
					isAuthenticated: false,
					isVerified: false,
					favouriteCourse: 'all',
					recieveAddedToScorecardMail: false,
					showLatestYearOnly: false
				});	
			});
	},

	setCookieValues({ commit },  {isAuthenticated, isVerified, favouriteCourse, recieveAddedToScorecardMail, showLatestYearOnly}) {
		commit('setIsAuthenticated', isAuthenticated);
		commit('setIsVerified', isVerified);
		commit('setFavouriteCourse', favouriteCourse);
		commit('setRecieveAddedToScorecardMail', recieveAddedToScorecardMail);
		commit('setShowLatestYearOnly', showLatestYearOnly);
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