<template>
	<div class="container">
		<div v-if="!signupSuccessful" class="input-container">
			<b-field :message="emailMessage" :type="emailType" label="Email">
				<b-input ref="emailInput" v-model="email" required type="email" />
			</b-field>

			<b-field label="Fornavn">
				<b-input ref="firstNameInput" v-model="firstName" required type="string" />
			</b-field>

			<b-field label="Etternavn">
				<b-input ref="lastNameInput" v-model="lastName" required type="string" />
			</b-field>

			<b-field label="Fødselsdato">
				<b-datepicker
					ref="birthdayInput"
					v-model="birthday"
					required
					placeholder="Trykk for å velge dato..."
					horizontal-time-picker
					locale="no-NB" />
			</b-field>

			<b-field label="Passord">
				<b-input ref="passwordInput" v-model="password" required minlength="8" autocomplete="new-password" type="password" />
			</b-field>

			<b-field :message="confirmPasswordMessage" :type="confirmPasswordType" label="Gjenta passord">
				<b-input ref="confirmPasswordInput" v-model="confirmPassword" required minlength="8" autocomplete="new-password" type="password" />
			</b-field>

			<button class="button is-primary" @click="createUser()">
				Lag bruker
			</button>
		</div>
		<p v-if="signupSuccessful" class="success-container">
			En verifikasjonsepost har blitt sendt til din epostadresse!
		</p>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'SignUpPage',
	
	data() {
		return {
			email: 'tvgb@outlook.com',
			emailMessage: '',
			emailType: '',
			firstName: 'tryn',
			lastName: 'borg',
			birthday: new Date(),
			password: '123123123',
			confirmPassword: '123123123',
			confirmPasswordType: '',
			confirmPasswordMessage: '',
			signupSuccessful: false
		};
	},
	
	methods: {
		...mapActions([
			'signUp',
			'getPlayers'
		]),

		createUser() {
			this.emailMessage = '';
			this.emailType = '';

			if (this.passwordValid() && this.inputsValid()) {
				this.signUp({
					email: this.email,
					firstName: this.firstName,
					lastName: this.lastName,
					birthday: this.birthday,
					password: this.password
				}).then(() => {
					this.signupSuccessful = true;
				}).catch((error) => {
					if (error.response.status === 422) {
						this.emailMessage = 'Ugyldig epost';
						this.emailType = 'is-danger';
					}
				});
			}
		},

		passwordValid() {
			this.confirmPasswordMessage = '';
			this.confirmPasswordType = '';

			if (!this.$refs.passwordInput.checkHtml5Validity() || !this.$refs.confirmPasswordInput.checkHtml5Validity()) {
				return false;
			}

			if (this.password !== this.confirmPassword) {
				this.confirmPasswordMessage = 'Passordene stemmer ikke overens';
				this.confirmPasswordType = 'is-danger';
				return false;
			}

			return true;
		},

		inputsValid() {
			return this.$refs.emailInput.checkHtml5Validity() &&
			this.$refs.firstNameInput.checkHtml5Validity() &&
			this.$refs.lastNameInput.checkHtml5Validity() &&
			this.$refs.birthdayInput.checkHtml5Validity();
		}
	}
}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: 75vh;
		padding: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.input-container {
		width: 100%;
	}

	.success-container {
		width: 100%;
		height: 50%;
		margin: auto 0;
		text-align: center
	}
	
	.field {
		height: auto;
		width: 100%;
	}

	.label {
		margin-bottom: 5px;
	}

	.button {
		margin-top: 20px;
		width: 100%;
	}

	@media only screen and (min-width: 600px) {
		.container {
			width: 500px;
		}

		.button {
			width: 250px;
		}		
	}

</style>