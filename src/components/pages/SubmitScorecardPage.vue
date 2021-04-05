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

		<div class="breaker" />

		<b-field horizontal label="Spiller">
			<b-select v-model="selectedPlayer" expanded>
				<option v-for="player in players" :key="player._id" :value="player">
					{{ player.firstName }} {{ player.lastName }}
				</option>
			</b-select>
		</b-field>

		<b-field horizontal label="Resultat">
			<b-field grouped>
				<b-numberinput v-model="sum" expanded :min="-99" :max="99" :step="1" :exponential="0.5" controls-alignment="right" />
				<b-button outlined class="add-round-btn button is-primary" @click="addRound()">
					<b-icon icon="user-plus" />
				</b-button>
			</b-field>
		</b-field>

		<div class="rounds-container">
			<div v-for="round in rounds" :key="round.player._id" class="round">
				<div>
					{{ round.player.lastName }}	| Resultat: {{ round.sum }}
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
			rounds: []
		}
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

			for (const round of this.rounds) {
				if (round.player._id === this.selectedPlayer._id) {
					return;
				}
			}

			if (this.selectedPlayer !== null) {
				const newRound = {
					sum: this.sum,
					player: this.selectedPlayer
				}

				this.sum = 0;
				this.selectedPlayer = null; 

				this.rounds.unshift(newRound);
				this.rounds.sort((a, b) => a.sum - b.sum);
			}
		},

		removeRound(round) {
			this.rounds = this.rounds.filter(r => r.player._id !== round.player._id);
		},

		submitRounds() {
			this.postScorecard({
				datetime: this.datetime,
				course: this.selectedCourse,
				rounds: this.rounds
			})
		}
	}
}
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
		background-color: #7957D5;
		color: white;
		padding: 15px 20px;
		border-radius: 5px;
		justify-content: space-between;
		margin: 5px 0;
	}

	.add-round-btn {
		margin-left: auto;
	}

	.trash-btn {
		cursor: pointer;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
			padding: 10px;
		}
	}
</style>