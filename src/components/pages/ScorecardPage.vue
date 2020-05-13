<template>
	<div class="container">
		<div>
			<h1 class="header">
				Siste runder
			</h1>
		</div>
		
		<div class="selector-container">

			<b-field class="select-field" label="Bane" horizontal>
				<b-select
					expanded
					placeholder="Alle">
					<option value="Alle">Alle</option>
					<option value="Parken Frisbeegolfbane (2019)">Parken Frisbeegolfbane (2019)</option>
					<option value="Parken Frisbeegolfbane">Parken Frisbeegolfbane</option>
					<option value="Bratten Frisbeegolfbane">Bratten Frisbeegolfbane</option>
				</b-select>
			</b-field>
			
			<b-field class="select-field" label="År" horizontal>
				<b-select
					expanded
					placeholder="2020">
					<option value="Alle">Alle</option>
					<option value="2020">2020</option>
					<option value="2019">2019</option>
					<option value="2018">2018</option>
					<option value="2017">2017</option>
				</b-select>
			</b-field>
		</div>
		<Scorecard 
		class="scorecard"
		v-for="scorecard in scorecards"
		v-bind:key="scorecard._id"
		v-bind:scorecard="scorecard">
		</Scorecard>
	</div>
</template>

<script>
import Scorecard from '../ui/Scorecard';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'ScorecardPage',
	components: {
		Scorecard
	},
	methods: {
		...mapActions(['getScorecards']),
		test() {
			console.log('This is a test');
		}
	},
	computed: mapGetters(['scorecards']),
	created() {
		this.getScorecards();
	}
}
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.selector-container {
		display: flex;
		flex-direction: column;
	}

	.scorecard {
		margin: 0 20px 20px 20px;
	}

	@media only screen and (min-width: 600px) {
		.container, .selector-container {
			width: 600px;
		}

		.selector-container {
			flex-direction: row;
		}

		.select-field {
			width: 300px;
		}
	}
</style>