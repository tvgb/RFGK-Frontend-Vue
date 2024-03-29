/* eslint-disable vue/attributes-order */
<template>
	<div class="container">
		<b-field horizontal label="Bane">
			<b-select v-model="selectedCourse" expanded :disabled="scorecardSubmitted">
				<option v-for="course in courses" :key="course._id" :value="course">
					{{ course.name }}
				</option>
			</b-select>
		</b-field>
		
		<b-field horizontal label="Dato">
			<b-datetimepicker
				v-model="datetime"
				:disabled="scorecardSubmitted"
				placeholder="Trykk for å velge dato..."
				horizontal-time-picker
				locale="no-NB" />
		</b-field>

		<b-field label="Værforhold">
			<div class="weather-div">
				<b-icon class="weather-icon" icon="cloud" :class="{'selected-weather': selectedWeather === 'cloud'}" @click.native="selectWeather('cloud')" />
				<b-icon class="weather-icon" icon="wind" :class="{'selected-weather': selectedWeather === 'wind'}" @click.native="selectWeather('wind')" />
				<b-icon class="weather-icon" icon="sun" :class="{'selected-weather': selectedWeather === 'sun'}" @click.native="selectWeather('sun')" />
				<b-icon class="weather-icon" icon="cloud-sun" :class="{'selected-weather': selectedWeather === 'cloud-sun'}" @click.native="selectWeather('cloud-sun')" />
				<b-icon class="weather-icon" icon="cloud-showers-heavy" :class="{'selected-weather': selectedWeather === 'cloud-showers-heavy'}" @click.native="selectWeather('cloud-showers-heavy')" />
				<b-icon class="weather-icon" icon="snowflake" :class="{'selected-weather': selectedWeather === 'snowflake'}" @click.native="selectWeather('snowflake')" />
			</div>		
		</b-field>

		<div class="breaker" />

		<b-field horizontal label="Spiller">
			<b-select ref="playerSelector" v-model="selectedPlayer" :disabled="scorecardSubmitted" expanded placeholder="Velg en spiller" @input="selectedPlayerChanged($event)">
				<option v-for="player in players" :key="player._id" :value="player">
					{{ player.firstName }} {{ player.lastName }}
				</option>
			</b-select>
		</b-field>

		<b-field horizontal label="Resultat">
			<b-field grouped :type="numberInputType" :message="numberInputMessage">
				<b-numberinput ref="resultInput" v-model.number="sum" :disabled="scorecardSubmitted" type="light-grey" expanded :step="1" :exponential="0.5" controls-alignment="right" />
				<b-button :disabled="scorecardSubmitted" class="add-round-btn is-primary" @click="addRound()">
					<b-icon icon="user-plus" />
				</b-button>
			</b-field>
		</b-field>

		<div class="rounds-container">
			<div v-for="round in rounds" :key="round.player._id" class="round">
				<div>
					<span class="tag" :style="getColor(round.sum)">
						{{ round.sum > 0 ? `+${round.sum}` : round.sum }}
					</span>
					{{ round.player.lastName }}
				</div>
				<div class="trash-btn" @click="removeRound(round)">
					<b-icon pack="fas" icon="trash" />
				</div>
			</div>
		</div>
		
		<div v-if="rounds.length > 1" class="btn-wrapper">
			<b-button :disabled="scorecardSubmitted" class="button is-success" @click="submitRounds()">
				Send inn
			</b-button>
		</div>
	</div>
</template>

<script>
import {mapGetters, mapActions } from 'vuex';

export default {
	name: 'SubmitScorecardPage',

	data() {
		return {
			datetime: new Date(),
			selectedCourse: null,
			selectedPlayer: null,
			sum: 0,
			rounds: [],
			selectedWeather: 'cloud',
			numberInputType: 'is-primary',
			numberInputMessage: '',
			scorecardSubmitted: false
		};
	},

	computed: {
		...mapGetters({
			courses: 'activeCourses',
			players: 'players'
		})
	},

	created() {
		this.getPlayers();
		this.getCourses();
	},

	methods: {
		...mapActions([
			'getPlayers',
			'getCourses',
			'postScorecard'
		]),

		addRound() {

			if (this.sum > 99 && this.sum > -99) {
				this.numberInputMessage = 'Tallet må være mellom -99 og 99.';
				this.numberInputType = 'is-danger';
				return;
			} else {
				this.numberInputMessage = '';
				this.numberInputType = 'is-primary';
			}

			for (const round of this.rounds) {
				if (round.player._id === this.selectedPlayer._id) {
					return;
				}
			}

			if (this.selectedPlayer !== null) {
				const newRound = {
					sum: this.sum,
					player: this.selectedPlayer
				};

				this.sum = 0;
				this.selectedPlayer = null; 

				this.rounds.unshift(newRound);
				this.rounds.sort((a, b) => a.sum - b.sum);

				this.$refs.playerSelector.focus();
			}
		},

		removeRound(round) {
			if (this.scorecardSubmitted) {
				return;
			}

			this.rounds = this.rounds.filter(r => r.player._id !== round.player._id);
		},

		selectedPlayerChanged() {
			this.$refs.resultInput.focus();
		},

		getColor(roundSum) {
			if (roundSum === null) {
				return 'color: #9A9A9A';
			}

			const superScore = 0;
			const goodScoore = 4;
			const okScore = 9;

			if (roundSum < superScore) {
				return 'background-color: #3BB2E2; color: white;';
			} else if (roundSum <= goodScoore) {
				return 'background-color: #48c774; color: white;';
			} else if (roundSum <= okScore) {
				return 'background-color: #ffdd57; color: black;';
			} else {
				return 'background-color: #f14668; color: white;';
			}
		},

		selectWeather(weather) {
			if (this.scorecardSubmitted) {
				return;
			}

			this.selectedWeather = weather;
		},

		submitRounds() {
			this.scorecardSubmitted = true;

			this.postScorecard({
				weather: this.selectedWeather,
				datetime: this.datetime,
				course: this.selectedCourse,
				rounds: this.rounds
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		padding: 0px 30px 30px 30px;
	}
	
	.breaker {
		border: 1px lightgray solid;
		width: 100%;
		margin: 20px 0;
	}

	.rounds-container {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.round {
		width: 100%;
		display: flex;
		background-color: white;
		box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.20);
		color: #363636;
		padding: 10px 12px;
		border-radius: 5px;
		justify-content: space-between;
		margin: 5px 0;
	}

	.selected-weather {
		color: $main-blue-100;
		font-size: 1.5rem;
		width: 1.5rem;
		height: 1.5rem;
	}

	.weather-icon {
		cursor: pointer;
		width: 50px;
		height: 50px;
	}

	.add-round-btn {
		margin-left: auto;
	}

	.trash-btn {
		cursor: pointer;
	}

	.tag {
		width: 35px;
		margin-right: 12px;
	}

	.btn-wrapper {
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		margin-top: 15px;
	}

	.weather-div {
		display: flex;
		justify-content: space-evenly;
		font-size: 1.2rem;
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 500px;
		}
	}
</style>
