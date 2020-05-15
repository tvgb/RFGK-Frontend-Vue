<template>
	<div class="container">
		<div>
			<h1 class="header">
				Siste runder
			</h1>
		</div>

		<div class="options-container">
			<button
				class="button"
				@click="toggleFilter()">
				Filter
			</button>
			<button
				disabled
				class="button is-primary">
				Add scorecard
			</button>
		</div>
		<div class="filter-container" :class="{ hide: hideFilter }">
			<div class="select-container">
				<div class="select-label"> Bane </div>
				<b-select v-model="selectedCourse" expanded @input="filterScorecards()">
					<option value="all"> Alle </option>
					<option v-for="course in courses" :key="course._id" v-bind:value="course._id">
						{{ course.name }}
					</option>
				</b-select>
			</div>

			<div class="select-container">
				<div class="select-label"> År </div>
				<b-select v-model="selectedYear" expanded @input="filterScorecards()">
					<option value="all">Alle</option>
					<option value="2020">2020</option>
					<option value="2019">2019</option>
					<option value="2018">2018</option>
					<option value="2017">2017</option>
				</b-select>
			</div>
		</div>
		<Scorecard
			v-for="scorecard in scorecards"
			:key="scorecard._id"
			:scorecard="scorecard"/>
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

	data: function() {
		return {
			hideFilter: true,
			selectedCourse: 'all',
			selectedYear: 'all'
		}
	},

	computed: mapGetters(['scorecards', 'courses']),

	created() {
		this.getScorecards({
			course: this.selectedCourse,
			year: this.selectedYear
		});
		this.getCourses();
	},

	methods: {
		...mapActions([
			'getScorecards',
			'getCourses'
		]),
		toggleFilter() {
			this.hideFilter = !this.hideFilter;
		},
		filterScorecards() {

			this.getScorecards({
				course: this.selectedCourse,
				year: this.selectedYear
			});
		}
	}
}
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.options-container {
		display: flex;
		width: 100%;
		justify-content: space-between;
		padding: 0 20px 10px 20px;
	}

	.filter-container {
		width: 100%;
	}

	.select-container {
		display: flex;
		margin: 10px;
	}

	.select-label {
		width: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.control {
		width: fit-content;
		margin: 0;
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 600px;
			padding: 0;
		}

		.options-container {
			padding: 0 0 20px 0;
		}
	}

	.hide {
		display: none;
	}

</style>