<template>
	<div class="container">
		<h1 class="header">
			Siste runder
		</h1>

		<div class="options-container">
			<b-button
				class="button"
				@click="toggleFilter()">
				Filter
			</b-button>
			<b-tooltip
				v-if="!isVerified || !isAuthenticated"
				label="Du må være logget inn og ha en verifisert epostadresse for å kunne legge til nye runder."
				size="is-small"
				multilined>
				<b-button
					:disabled="true"
					tag="router-link" to="/submitScorecard" type="is-link"
					class="button is-primary">
					Legg til runde
				</b-button>
			</b-tooltip>
			<b-button
				v-if="isVerified && isAuthenticated"
				tag="router-link" to="/submitScorecard" type="is-link"
				class="button is-primary">
				Legg til runde
			</b-button>
			
		</div>
		<div class="filter-container" :class="{ hide: hideFilter }">
			<div class="select-container">
				<div class="select-label"> Bane </div>
				<b-select v-model="selectedCourse" expanded @input="filterScorecards()">
					<option value="all"> Alle </option>
					<option v-for="course in courses" :key="course._id" v-bind:value="course">
						{{ course.name }}
					</option>
				</b-select>
			</div>

			<div class="select-container">
				<div class="select-label"> År </div>
				<b-select v-model="selectedYear" expanded @input="filterScorecards()">
					<option value="all">Alle</option>
					<option value="2021">2021</option>
					<option value="2020">2020</option>
					<option value="2019">2019</option>
					<option value="2018">2018</option>
				</b-select>
			</div>
		</div>
		<Scorecard
			v-for="scorecard in scorecards"
			:key="scorecard._id"
			:scorecard="scorecard"/>
		<div class="no-scorecards-card" v-if="scorecards && scorecards.length === 0 && !isLoading" >
			Ingen runder finnes for valgte filter
		</div>
		<b-loading :active.sync="isLoading" :is-full-page="true"></b-loading>

	</div>
</template>

<script>
import Scorecard from '../ui/Scorecard';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
	name: 'ScorecardPage',

	components: {
		Scorecard
	},

	data: function() {
		return {
			hideFilter: true,
			selectedCourse: 'all',
			selectedYear: 'all',
			isLoading: false
		}
	},

	computed: {
		...mapGetters([
			'scorecards', 
			'courses'
		]),

		...mapState({
			showLatestYearOnly: state => state.player.showLatestYearOnly,
			favouriteCourse: state => state.player.favouriteCourse,
			isVerified: state => state.player.isVerified,
			isAuthenticated: state => state.player.isAuthenticated
		})
	},

	created() {
		this.getCourses();

		if (this.favouriteCourse !== null) {
			this.selectedCourse = this.favouriteCourse
		}

		if (this.showLatestYearOnly) {
			this.selectedYear = (new Date()).getFullYear(); 
		}

		this.isLoading = true;
		const courseId = this.selectedCourse === 'all' ? 'all' : this.selectedCourse._id;
		this.getScorecards({
			courseId: courseId,
			year: this.selectedYear
		}).then(() => {
			this.isLoading = false;
		})
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
			const courseId = this.selectedCourse === 'all' ? 'all' : this.selectedCourse._id;
			this.getScorecards({
				courseId: courseId,
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
		padding: 0;
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

	.no-scorecards-card {
		padding-top: 100px;
	}

</style>