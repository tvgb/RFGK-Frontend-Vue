<template>
	<div class="container">
		<h1 class="header">
			Profil
		</h1>

		<b-field label="Endre email">
			<b-input></b-input>
		</b-field>

		<b-field label="Endre passord">
			<b-input></b-input>
		</b-field>

		<b-field label="Gammelt passord">
			<b-input></b-input>
		</b-field>

		<div class="breaker"></div>

		<b-button class="verification-button">
			Send verifikasjons-epost på nytt
		</b-button>
		
		<div class="breaker"></div>

		<div class="field">
			<b-checkbox v-model="selectedRecieveAddedToScorecardMail">
				Motta mail når du har blitt lagt til i en runde.
			</b-checkbox>
		</div>
		<div class="field">
			<b-checkbox v-model="selectedShowLatestYearOnly">
				Sett filter automatisk til å vise runder fra siste år. 
			</b-checkbox>
		</div>
	
		<b-field label="Favorittbane">
			<b-select v-model="selectedFavouriteCourse" expanded>
				<option value="all"> Alle </option>
				<option v-for="course in courses" :key="course._id" v-bind:value="course">
					{{ course.name }}
				</option>
			</b-select>
		</b-field>

		<b-button @click="onUpdateSettings()" class="save-button">
			Lagre
		</b-button>
		
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';


export default {
	name: 'ProfilePage',

	data() {
		return {
			selectedFavouriteCourse: null,
			selectedShowLatestYearOnly: false,
			selectedRecieveAddedToScorecardMail: false
		}
	},

	computed: {
		...mapGetters([
			'courses',
			'favouriteCourse',
			'recieveAddedToScorecardMail',
			'showLatestYearOnly'
		])
	},

	created() {
		this.getCourses();

		console.log(this.favouriteCourse, this.showLatestYearOnly, this.recieveAddedToScorecardMail);
		
		if (this.favouriteCourse === null) {
			this.selectedFavouriteCourse = 'all';
		} else {
			this.selectedFavouriteCourse = this.favouriteCourse;
		}
		
		this.selectedShowLatestYearOnly = this.showLatestYearOnly;
		this.selectedRecieveAddedToScorecardMail = this.recieveAddedToScorecardMail;
	},

	methods: {
		...mapActions([
			'getCourses',
			'updateSettings'
		]),

		onUpdateSettings() {
			const updatedSuccessfully = this.updateSettings({
				favouriteCourse: this.selectedFavouriteCourse,
				recieveAddedToScorecardMail: this.selectedRecieveAddedToScorecardMail,
				showLatestYearOnly: this.selectedShowLatestYearOnly
			});
		}
	}

}
</script>

<style>
.container {
	width: 500px;
	display: flex;
	flex-direction: column;
}

.verification-button {
	align-self: center;
}

.save-button {
	align-self: flex-end;
}

.breaker {
	border: 1px lightgray solid;
	width: 100%;
	margin: 20px 0;
}

@media only screen and (max-width: 600px) {
	.container {
		width: 100%;
		padding: 10px 30px;
	}
}
</style>