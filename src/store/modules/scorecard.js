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
			const winnersBonus = 20;
			const startTime = new Date(new Date().getFullYear(), 4, 30).getTime();
			const endTime = new Date(new Date().getFullYear(), 9, 1).getTime();
			
			for (let scorecard of state.scorecards) {
				const scorecardTime = new Date(scorecard.datetime).getTime();
				if (scorecard.rounds.length > 2 && scorecardTime > startTime && scorecardTime < endTime) {
					for (let round of scorecard.rounds) {
						let scoreAdjustedForHandicap = round.numberOfThrows - scorecard.course.par;

						if (round.handicapRating) {
							scoreAdjustedForHandicap -= Math.round(round.handicapRating);
						}

						Object.assign(round, {scoreAdjustedForHandicap: scoreAdjustedForHandicap});
					}

					const rounds = scorecard.rounds.sort((a, b) => a.scoreAdjustedForHandicap - b.scoreAdjustedForHandicap);
					const winningScore = rounds[0].scoreAdjustedForHandicap;

					const winnersCount = rounds.filter(r => r.scoreAdjustedForHandicap === winningScore).length;
					
					for (let round of rounds) {
						const existingPlayer = players.find(p => p.player._id === round.player._id);
						Object.assign(round, {bonus: round.scoreAdjustedForHandicap === winningScore ? winnersBonus / winnersCount : 0});
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
				const scores = calculateScores(player.rounds);
				const roundSums = getRoundSums(player.rounds);

				Object.assign(player, {scores: scores, sum: scores.reduce((a, b) => a + b, 0), roundSums: roundSums});
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
				const usedCourse = mostUsed.courses.find(c => c._id === course._id);
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

/**
 *	f(x) = {
 *		 		g(x):	x <= 20 , 
 *				h(x):	x > 20 
 *			}
 *
 *	g(x) = 0.3x^2 - 13.5x + 180
 *	h(x) = -0.375x + 37.5
 */
function calculateScores(rounds) {
	const scores = [];

	rounds = rounds.sort((a, b) => a.scoreAdjustedForHandicap - b.scoreAdjustedForHandicap);

	for (let i = 0; i < 5; i++) {
		if (i < rounds.length) {
			let sum = rounds[i].scoreAdjustedForHandicap;
			let score = sum <= 20 ? 0.3 * sum * sum - 13.5 * sum + 180 : -0.375 * sum + 37.5;
			score += rounds[i].bonus;
			scores.push(Math.floor(score));
		} else {
			scores.push(0);
		}
	}

	return scores;
}

function getRoundSums(rounds) {
	const roundSums = [];
	
	rounds = rounds.sort((a, b) => a.scoreAdjustedForHandicap - b.scoreAdjustedForHandicap);
	
	for (let i = 0; i < 5; i++) {
		if (i < rounds.length) {
			roundSums.push(rounds[i].scoreAdjustedForHandicap);
		} else {
			roundSums.push(null);
		}
	}

	return roundSums;
}

export default {
	state,
	getters,
	actions,
	mutations
};