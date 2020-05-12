77<template>
	<div class="container">
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

	.scorecard {
		margin: 20px;
	}
</style>