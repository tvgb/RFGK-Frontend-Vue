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
		});
	},

	async postScorecard({}, {course, datetime, rounds, weather}) {
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
			let mostUsed = JSON.parse(localStorage.getItem('mostUsed'));

			if (mostUsed) {
				const usedCourse = mostUsed.courses.find(c => c._id === course._id)
				if (usedCourse) {
					usedCourse.uses ++;
				} else {
					mostUsed.courses.push({_id: course._id, uses: 1});
				}

				for (let round of rounds) {
					const usedPlayer = mostUsed.players.find(p => p._id === round.player._id);
					if (usedPlayer) {
						usedPlayer.uses ++;
					} else {
						mostUsed.players.push({_id: round.player._id, uses: 1});
					}
				}

			} else {
				mostUsed = {
					courses: [
						{_id: course._id, uses: 1}
					],
	
					players: [
					]
				};

				for (let round of rounds) {
					mostUsed.players.push({_id: round.player._id, uses: 1});
				}
			}

			localStorage.setItem('mostUsed', JSON.stringify(mostUsed));
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