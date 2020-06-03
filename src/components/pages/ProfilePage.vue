<template>
	<div class="container">
		<h1 class="header">
			Profil
		</h1>

		<b-field :message="oneChangeNeededMessage" :type="oneChangeNeededType" label="Endre email">
			<b-input type="email" v-model="newEmail"/>
		</b-field>

		<b-field :message="oneChangeNeededMessage" :type="oneChangeNeededType" label="Endre passord">
			<b-input autocomplete="new-password" type="password" v-model="newPassword" />
		</b-field>

		<b-field :message="oldPwMessage" :type="oldPwType" label="Gammelt passord">
			<b-input autocomplete="new-password" type="password" v-model="oldPassword" />
		</b-field>

		<b-button @click="onUpdatePersonalInfo()" class="save-button">
			Lagre
		</b-button>

		<div class="feedback-div">
			{{ feedback_1 }}
		</div>

		<div v-if="!isVerified" class="breaker" />

		<b-button :disabled="disableSendVerificationMailButton" @click="onSendVerificationMail()" v-if="!isVerified" class="verification-button">
			Send verifikasjons-epost på nytt
		</b-button>
		
		<div class="feedback-div">
			{{ feedback_3 }}
		</div>

		<div class="breaker" />

		<div class="field" v-if="isVerified">
			<b-checkbox v-model="selectedRecieveAddedToScorecardMail">
				Motta mail når du har blitt lagt til i en runde.
			</b-checkbox>
		</div>
		<div class="field">
			<b-checkbox v-model="selectedShowLatestYearOnly">
				Sett filter automatisk til å vise runder fra {{ (new Date()).getFullYear() }}. 
			</b-checkbox>
		</div>
	
		<b-field label="Favorittbane">
			<b-select v-model="selectedFavouriteCourse" expanded>
				<option value="all"> Alle </option>
				<option v-for="course in courses" :key="course._id" :value="course">
					{{ course.name }}
				</option>
			</b-select>
		</b-field>

		<b-button class="save-button" @click="onUpdateSettings()">
			Lagre
		</b-button>
		<div class="feedback-div">
			{{ feedback_2 }}
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';


export default {
	name: 'ProfilePage',

	data() {
		return {
			selectedFavouriteCourse: null,
			selectedShowLatestYearOnly: false,
			selectedRecieveAddedToScorecardMail: false,
			feedback_1: '',
			feedback_2: '',
			feedback_3: '',
			oldPwMessage: '',
			oldPwType: '',
			oneChangeNeededMessage: '',
			oneChangeNeededType: '',
			newEmail: '',
			newPassword: '',
			oldPassword: '',
			disableSendVerificationMailButton: false
		}
	},

	computed: {
		...mapGetters([
			'courses',
		]),
		...mapState({
			favouriteCourse: state => state.player.favouriteCourse,
			showLatestYearOnly: state => state.player.showLatestYearOnly,
			recieveAddedToScorecardMail: state => state.player.recieveAddedToScorecardMail,
			isVerified: state => state.player.isVerified
		})
	},

	created() {
		this.getCourses();

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
			'updateSettings',
			'updatePersonalInfo',
			'sendVerificationMail'
		]),

		onUpdateSettings() {
			this.updateSettings({
				favouriteCourse: this.selectedFavouriteCourse,
				recieveAddedToScorecardMail: this.selectedRecieveAddedToScorecardMail,
				showLatestYearOnly: this.selectedShowLatestYearOnly
			}).then(() => {
				this.feedback = 'Lagret!'
				setTimeout(() => {
					this.feedback_2 = '';
				}, 3000);
			}).catch(() => {
				this.feedback = 'Noe gikk galt...'
				setTimeout(() => {
					this.feedback_2 = '';
				}, 3000);
			});
		},

		onUpdatePersonalInfo() {
			if (this.oldPassword.trim() === '') {
				this.oldPwMessage = 'Nåværende passord trengs for å lagre endringer.';
				this.oldPwType = 'is-danger';
				return;
			} else {
				this.oldPwMessage = '';
				this.oldPwType = '';
				this.oneChangeNeededMessage = ''
				this.oneChangeNeededType = '';
			}

			if (this.newEmail.trim() === '' && this.newPassword === '') {
				this.oneChangeNeededMessage = 'Minst ett felt må endres for å lagre endringer.'
				this.oneChangeNeededType = 'is-danger';
				return;
			} else  {
				this.oneChangeNeededMessage = ''
				this.oneChangeNeededType = '';
				this.oldPwMessage = '';
				this.oldPwType = '';
			}



			this.updatePersonalInfo({
				newEmail: this.newEmail,
				newPassword: this.newPassword,
				oldPassword: this.oldPassword
			}).then(() => {
				this.feedback_1 = 'Lagret!';
				setTimeout(() => {
					this.feedback_1 = '';
				}, 3000);
			}).catch((error) => {
				if (error.response.status === 400) {
					this.oldPwMessage = 'Feil passord';
					this.oldPwType = 'is-danger';
				} else {
					this.feedback_1 = 'Noe gikk galt...';
					setTimeout(() => {
						this.feedback_1 = '';
					}, 3000);
				}
				
			});
		},

		onSendVerificationMail() {
			this.sendVerificationMail().then(() => {
				this.feedback_3 = 'Mail sendt!';
				this.disableSendVerificationMailButton = true;
				setTimeout(() => {
					this.feedback_3 = '';
				}, 3000);
			}).catch(() => {
				this.feedback_3 = 'Noe gikk galt...';
				this.disableSendVerificationMailButton = false;
				setTimeout(() => {
					this.feedback_3 = '';
				}, 3000);
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

.feedback-div {
	text-align: center;
	color: #7957d5;
}

@media only screen and (max-width: 600px) {
	.container {
		width: 100%;
		padding: 10px 30px;
	}
}
</style>