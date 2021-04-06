import repository from '../repository';
import router from '../../router';


const state = {
	scorecards: []
};

const getters = {
	scorecards: state => state.scorecards
};


const endpoint = 'scorecard';
const actions = {
	async getScorecards({ commit }, {courseId, year}) {
		return repository.get(`/${endpoint}?courseId=${courseId}&year=${year}`).then((response) => {
			commit('setScorecards', response.data);
		})
	},

	async postScorecard({ commit }, {course, datetime, rounds, weather}) {
		await repository.post(`/${endpoint}`, 
			{
				weather,
				course,
				datetime,
				rounds
			}, 
			{
				withCredentials: true
			}
		).then(() => {
			router.push('/');

		}).catch((error) => {
			console.log(error);
		});

	}
};

const mutations = {
	setScorecards: (state, scorecards) => (state.scorecards = scorecards),
	addScorecard: (state, scorecard) => (state.scorecards.unshift(scorecard))
};

export default {
	state,
	getters,
	actions,
	mutations
};