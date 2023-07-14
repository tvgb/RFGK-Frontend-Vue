<template>
	<div class="container">
		<div class="options-container">
			<button
				class="btn filter-btn"
				@click="toggleFilter()">
				FILTER
			</button>
			<b-tooltip
				v-if="!isVerified || !isAuthenticated"
				label="Du må være logget inn og ha en verifisert epostadresse for å kunne legge til nye runder."
				size="is-small"
				multilined
				position="is-bottom">
				<button
					:disabled="true"
					class="btn add-scorecard-btn-disabled">
					LEGG TIL RUNDE
				</button>
			</b-tooltip>
			<button
				v-if="isVerified && isAuthenticated"
				class="btn add-scorecard-btn"
				@click="navTo('/submitScorecard')">
				LEGG TIL RUNDE
			</button>
		</div>
		<div class="filter-container" :class="{ hide: hideFilter }">
			<div class="select-container">
				<div class="select-label"> Bane </div>
				<b-select v-model="selectedCourse" @input="filterScorecards()">
					<option value="all"> Alle </option>
					<option v-for="course in courses" :key="course._id" :value="course">
						{{ course.name }}
					</option>
				</b-select>
			</div>

			<div class="select-container">
				<div class="select-label"> År </div>
				<b-select v-model="selectedYear" @input="filterScorecards()">
					<option value="all">Alle</option>
					<option v-for="year in years" :key="year" :value="year"> {{ year }} </option>
				</b-select>
			</div>
		</div>
		<Scorecard
			v-for="scorecard in scorecards"
			:key="scorecard._id"
			:scorecard="scorecard" />
		<div v-if="scorecards && scorecards.length === 0 && !isLoading" class="no-scorecards-card">
			Ingen runder finnes for valgte filter
		</div>
		<b-loading :active.sync="isLoading" :is-full-page="true" />
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
			isLoading: false,
			years: []
		};
	},

	computed: {
		...mapGetters({
			courses: 'allCourses',
			scorecards: 'scorecards'   
		}),

		...mapState({
			showLatestYearOnly: state => state.player.showLatestYearOnly,
			favouriteCourse: state => state.player.favouriteCourse,
			isVerified: state => state.player.isVerified,
			isAuthenticated: state => state.player.isAuthenticated
		})
	},

	created() {
		this.getCourses();

		const startYear = 2018;
		const thisYear = new Date().getFullYear();

		for (let start = startYear - 1; start <= thisYear; start++) {
			this.years.unshift(start);
		}

		if (this.favouriteCourse !== null) {
			this.selectedCourse = this.favouriteCourse;
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
		});
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
		},

		navTo(route) {
			this.$router.push({path: route});
		}
	}
};
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
	}

	.add-scorecard-btn, .add-scorecard-btn-disabled {
		width: 140px;
	}

	.add-scorecard-btn-disabled {
		background-color: $main-grey-200;
		cursor: not-allowed;
	}

	.filter-btn {
		background-color: white;
		color: $main-blue-200;
		border: 1px solid $main-blue-200;
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

	.hide {
		display: none;
	}

	.no-scorecards-card {
		padding-top: 100px;
	}

	div.select-container:nth-child(1) > div:nth-child(2) {
		width: calc(100% - 100px);
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 700px;
			padding: 0;
		}

		.options-container {
			padding: 0 0 20px 0;
		}
	}
</style>