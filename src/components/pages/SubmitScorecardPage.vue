<template>
	<div class="container">
		<h1 class="header">
			Legg til runde
		</h1>

		<b-field horizontal label="Bane">
			<b-select v-model="selectedCourse" expanded>
				<option v-for="course in courses" :key="course._id" :value="course">
					{{ course.name }}
				</option>
			</b-select>
		</b-field>
		
		<b-field horizontal label="Dato">
			<b-datetimepicker
				v-model="datetime"
				placeholder="Click to select..."
				horizontal-time-picker />
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
			<b-select ref="playerSelector" v-model="selectedPlayer" expanded placeholder="Velg en spiller" @focus="playerSelectFocus()" @input="selectedPlayerChanged($event)">
				<option v-for="player in players" :key="player._id" :value="player">
					{{ player.firstName }} {{ player.lastName }}
				</option>
			</b-select>
		</b-field>

		<b-field horizontal label="Resultat">
			<b-field grouped :type="numberInputType" :message="numberInputMessage">
				<b-numberinput ref="resultInput" v-model.number="sum" expanded :step="1" :exponential="0.5" controls-alignment="right" />
				<b-button outlined class="add-round-btn button is-primary" @click="addRound()">
					<b-icon icon="user-plus" />
				</b-button>
			</b-field>
		</b-field>

		<div class="rounds-container">
			<div v-for="round in rounds" :key="round.player._id" class="round">
				<div>
					<span class="tag" :class="getColor(round.sum)">
						{{ round.sum > 0 ? `+${round.sum}` : round.sum }}
					</span>
					{{ round.player.lastName }}
				</div>
				<div class="trash-btn" @click="removeRound(round)">
					<b-icon pack="fas" icon="trash" />
				</div>
			</div>
		</div>

		<b-field v-if="rounds.length >= 2" horizontal>
			<p class="control">
				<b-button class="button is-success" @click="submitRounds()">
					Send inn
				</b-button>
			</p>
		</b-field>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions } from 'vuex';

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
			numberInputMessage: ''
		};
	},

	computed: {
		...mapGetters([
			'courses'
		]),
		...mapState({
			players: state => state.player.players
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

			console.log(this.sum);

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
			this.rounds = this.rounds.filter(r => r.player._id !== round.player._id);
		},

		playerSelectFocus() {
			this.selectedPlayer = this.players[0];
		},

		selectedPlayerChanged() {
			this.$refs.resultInput.focus();
		},

		getColor(score) {
			const goodScoore = 5;
			const okScore = 10;

			if (score <= goodScoore) {
				return 'is-success';
			} else if (score <= okScore) {
				return 'is-warning';
			} else {
				return 'is-danger';
			}
		},

		selectWeather(weather) {
			this.selectedWeather = weather;
		},

		submitRounds() {
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

<style scoped>
	.container {
		width: 500px;
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
		color: #7957d5;
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

	.weather-div {
		display: flex;
		justify-content: space-evenly;
		font-size: 1.2rem;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
			padding: 10px;
		}
	}
</style>