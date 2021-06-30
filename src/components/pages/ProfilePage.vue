<template>
	<div class="container">
		<b-field label="Endre email">
			<b-input ref="emailInput" v-model="newEmail" type="email" />
		</b-field>

		<button class="btn save-button" @click="updateEmail()">
			LAGRE
		</button>

		<div class="breaker" />

		<b-field label="Nytt passord">
			<b-input ref="newPwInput" v-model="newPassword" required minlength="8" autocomplete="new-password" type="password" />
		</b-field>

		<b-field :message="oldPwMessage" :type="oldPwType" label="Gammelt passord">
			<b-input ref="oldPwInput" v-model="oldPassword" required minlength="8" autocomplete="new-password" type="password" />
		</b-field>

		<button class="btn save-button" @click="updatePassword()">
			LAGRE
		</button>

		<div v-if="!isVerified" class="breaker" />

		<button v-if="!isVerified" :disabled="disableSendVerificationMailButton" class="verification-button btn" @click="onSendVerificationMail()">
			Send verifikasjons-epost på nytt
		</button>

		<div class="breaker" />

		<div v-if="isVerified" class="field">
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

		<button class="btn save-button" @click="onUpdateSettings()">
			LAGRE
		</button>

		<div v-if="admin" class="breaker" />

		<div v-if="admin" class="unverified-player-container">
			<div v-for="player in unverifiedPlayers" :key="player._id" class="unverified-player">
				{{ player.firstName }} {{ player.lastName }}
				<b-icon type="is-success"
					pack="fas"
					icon="check-square"
					size="is-large" />
			</div>			
		</div>

		<div class="breaker" />
		<button class="btn log-out-btn" @click="logout()">
			LOGG UT
		</button>
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
			oldPwMessage: '',
			oldPwType: '',
			newEmail: '',
			newPassword: '',
			oldPassword: '',
			disableSendVerificationMailButton: false
		};
	},

	computed: {
		...mapGetters({
			courses: 'allCourses'
		}),
		...mapState({
			favouriteCourse: state => state.player.favouriteCourse,
			showLatestYearOnly: state => state.player.showLatestYearOnly,
			recieveAddedToScorecardMail: state => state.player.recieveAddedToScorecardMail,
			isVerified: state => state.player.isVerified,
			admin: state => state.player.admin,
			unverifiedPlayers: state => state.player.unverifiedPlayers
		})
	},

	created() {
		this.getCourses();
		this.getUnverifiedPlayers();

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
			'sendVerificationMail',
			'logout',
			'getUnverifiedPlayers'
		]),

		onUpdateSettings() {
			this.updateSettings({
				favouriteCourse: this.selectedFavouriteCourse,
				recieveAddedToScorecardMail: this.selectedRecieveAddedToScorecardMail,
				showLatestYearOnly: this.selectedShowLatestYearOnly
			}).then(() => {
				this.openToast('Lagret!', 'is-success');
			}).catch(() => {
				this.openToast('Noe gikk galt...', 'is-danger');
			});
		},

		updateEmail() {
			if (this.newEmail.trim() === '' || !this.$refs.emailInput.checkHtml5Validity()) {
				return;
			}

			this.updatePersonalInfo({
				newEmail: this.newEmail,
				newPassword: undefined,
				oldPassword: undefined
			}).then(() => {
				this.openToast('Lagret!', 'is-success');
			}).catch(() => {
				this.openToast('Noe gikk galt...', 'is-danger');
			});
		},

		updatePassword() {

			this.oldPwMessage = '';
			this.oldPwType = '';

			if (!this.$refs.newPwInput.checkHtml5Validity() || !this.$refs.oldPwInput.checkHtml5Validity()) {
				return;
			}

			this.updatePersonalInfo({
				newEmail: undefined,
				newPassword: this.newPassword,
				oldPassword: this.oldPassword
			}).then(() => {
				this.openToast('Lagret!', 'is-success');
			}).catch((error) => {
				if (error.response.status === 400) {
					this.oldPwMessage = 'Feil passord';
					this.oldPwType = 'is-danger';
				} else {
					this.openToast('Noe gikk galt...', 'is-danger');
				}
			});
		},

		onSendVerificationMail() {
			this.sendVerificationMail().then(() => {
				this.disableSendVerificationMailButton = true;
				this.openToast('Mail sendt!', 'is-success');
			}).catch(() => {
				this.disableSendVerificationMailButton = false;
				this.openToast('Noe gikk galt...', 'is-danger');
			});
		},

		openToast(message, type) {
			this.$buefy.toast.open({
				message: message,
				type: type,
				position: 'is-bottom',
				duration: 3000
			});
		}
	}

}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 0px 30px 30px 30px;
}

.verification-button, .log-out-btn {
	align-self: center;
	width: 90%;
}

.save-button {
	align-self: flex-end;
}

.breaker {
	border: 1px lightgray solid;
	width: 100%;
	margin: 20px 0;
}

.unverified-player {
	width: 100%;
	border: 1px solid lightgrey;
	margin-bottom: 10px;
	border-radius: 5px;
	padding-left: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

@media only screen and (min-width: 600px) {
	.container {
		width: 400px;
	}
}
</style>