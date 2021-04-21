import repository from '../repository';
import router from '../../router';


const state = {
	scorecards: [],
};

const getters = {
	scorecards: state => state.scorecards,
	leagueTablePlayers: state => {

		if (state.scorecards.length > 0) {
			const players = [];
			const range = 50;
			const maxScore = 125;
			const pointsList = createPointsList(maxScore, range);

			for (let scorecard of state.scorecards) {
				if (scorecard.rounds.length > 2) {
					for (let round of scorecard.rounds) {
						const existingPlayer = players.find(p => p.player._id === round.player._id);
						if (existingPlayer) {
							existingPlayer.rounds.push(round);
						} else {
							players.push({
								player: { ...round.player },
								rounds: [
									{ ...round }
								] 
							});
						}
					}
				}
			}
	
			for (let player of players) {
				const scores = calculateScores(player.rounds, state.scorecards[0].course, pointsList, range).sort((a, b) => b - a);
				Object.assign(player, {scores: scores, sum: scores.reduce((a, b) => a + b, 0)});
				// Object.assign(player, {scores: scores, sum: Math.floor(Math.random() * 1000)});
			}
			return players.sort((a, b) => {
				if (a.sum < b.sum) {
					return 1;
				} else if (a.sum > b.sum) {
					return -1;
				} else {
					return 0;
				}
			});
		}

		return [];
	}
};

const endpoint = 'scorecard';
const actions = {
	async getScorecards({ commit }, {courseId, year}) {
		return repository.get(`/${endpoint}?courseId=${courseId}&year=${year}`).then((response) => {
			commit('setScorecards', response.data);
			return response.data;
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

function calculateScores(rounds, course, pointsList, range) {
	const scores = [];

	rounds = rounds.sort((a, b) => {
		if (a.numberOfThrows > b.numberOfThrows) {
			return -1;
		} else if (a.numberOfThrows < b.numberOfThrows) {
			return 1;
		} else {
			return 0;
		}
	});
	
	const shift = course.holes;

	for (let i = 0; i < 8; i++) {
		if (i < rounds.length) {
			const sumAfterShift = (rounds[i].numberOfThrows - course.par) + shift;
			scores.push(calculateScore(pointsList, sumAfterShift, range));
		} else {
			scores.push(0);
		}
	}

	return scores;
}

function createPointsList(maxScore, range) {
	const point = maxScore/range;
	const pointsList = [];
	const factor = 0.01;
	let counter = range/2;

	for (let i = 0; i < range; i++) {
		pointsList.push(point + factor * counter);
		counter--;
		counter = counter === 0 ? -1 : counter;
	}

	return pointsList;
}

function calculateScore(pointsList, sumAfterShift, range) {
	let sum = 0;
	for (let i = 0; i < range - sumAfterShift; i++) {
		sum += pointsList[i];
	}
	return Math.floor(sum);
}

export default {
	state,
	getters,
	actions,
	mutations
};