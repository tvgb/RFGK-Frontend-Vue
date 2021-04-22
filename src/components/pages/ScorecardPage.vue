<template>
	<div class="container">
		<h1>
			SCORECARDS
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
				<button
					:disabled="true"
					class="add-scorecard-btn">
					LEGG TIL RUNDE
				</button>
			</b-tooltip>
			<button
				v-if="isVerified && isAuthenticated"
				class="add-scorecard-btn"
				@click="navTo('/submitScorecard')">
				LEGG TIL RUNDE
			</button>
		</div>
		<div class="filter-container" :class="{ hide: hideFilter }">
			<div class="select-container">
				<div class="select-label"> Bane </div>
				<b-select v-model="selectedCourse" expanded @input="filterScorecards()">
					<option value="all"> Alle </option>
					<option v-for="course in courses" :key="course._id" :value="course">
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
			isLoading: false
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
}
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
	}

	h1 {
		font-size: 28px;
		font-family: 'Montserrat';
		font-weight: 800;
		font-style: italic;
		padding: 20px;

		background-image: linear-gradient(90deg, rgba(60,109,125,1) 0%, rgba(126,222,254,1) 100%);
		background-clip: text;
		color: transparent;
		background-size: 400%;

		animation: bg-animation 5s infinite alternate;
	}

	@keyframes bg-animation {
		0% {
			background-position: left;
		}
		100% {
			background-position: right;
		}
	}

	.add-scorecard-btn {
		width: 140px;
		height: 40px;
		font-family: 'Montserrat';
		color: white;
		font-weight: 500;
		background-color: #70C8E5;
		box-shadow: none;
		border: 0;
		border-radius: 4px;
		font-size: 0.9rem;
		letter-spacing: -1px;
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