<template>
	<div class="container">
		<Scorecard class="scorecard" v-for="n in 10" v-bind:key="n"></Scorecard>
	</div>
</template>

<script>
import Scorecard from '../ui/Scorecard';

export default {
	name: 'ScorecardPage',
	components: {
		Scorecard
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