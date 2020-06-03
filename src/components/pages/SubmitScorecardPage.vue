<template>
	<div class="container">
		<h1 class="header">
			Legg til runde
		</h1>

		<b-field horizontal label="Bane">
			<b-select expanded v-model="selectedCourse">
				<option v-for="course in courses" :key="course._id" v-bind:value="course">
					{{ course.name }}
				</option>
			</b-select>
		</b-field>
		
		<b-field horizontal label="Dato">
			<b-datetimepicker
				placeholder="Click to select..."
				horizontal-time-picker
				v-model="datetime">
				
			</b-datetimepicker>
		</b-field>

		<div class="breaker"></div>

		<b-field horizontal label="Spiller">
			<b-select expanded v-model="selectedPlayer">
				<option v-for="player in players" :key="player._id" v-bind:value="player">
					{{ player.firstName }} {{ player.lastName }}
				</option>
			</b-select>
		</b-field>

		<b-field horizontal label="Resultat">
			<b-slider v-model="sum" size="is-medium" :min="-10" :max="30">
			</b-slider>
		</b-field>

		<b-field horizontal><!-- Label left empty for spacing -->
			<p class="control">
				<b-button outlined @click="addRound()" class="add-round-button button is-primary">
					Legg til spiller
				</b-button>
			</p>
		</b-field>

		<div class="rounds-container">
			<div class="round" v-for="round in rounds" :key="round.player._id">
				<div>
					{{ round.player.lastName }}	| Resultat: {{ round.sum }}
				</div>
				<div>
					<font-awesome-icon @click="removeRound(round)" icon="trash-alt"/>
				</div>
			</div>
		</div>

		<b-field v-if="this.rounds.length >= 2" horizontal><!-- Label left empty for spacing -->
			<p class="control">
				<b-button @click="submitRounds()" class="button is-success">
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
			}
		},

		removeRound(round) {
			this.rounds = this.rounds.filter((value, index, arr) => (value.player._id !== round.player._id));
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

	.add-round-button {
		float: right;
	}

	@media only screen and (max-width: 600px) {
		.container {
			width: 100%;
			padding: 10px;
		}
	}
</style>